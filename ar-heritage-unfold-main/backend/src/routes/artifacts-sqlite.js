import express from 'express';
import db from '../config/database-sqlite.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToLocal } from '../config/storage.js';
import Joi from 'joi';

const router = express.Router();

const artifactSchema = Joi.object({
  name: Joi.string().required(),
  origin: Joi.string(),
  age_years: Joi.number(),
  era: Joi.string(),
  material: Joi.string(),
  cultural_significance: Joi.string(),
  discovery_site: Joi.string(),
  discovery_date: Joi.date(),
  current_location: Joi.string(),
  museum_id: Joi.number(),
  dimensions: Joi.string(),
  weight_kg: Joi.number(),
  condition_status: Joi.string(),
  description: Joi.string(),
  category_ids: Joi.array().items(Joi.number()),
});

// POST /artifacts/scan - Mock AI recognition for local dev
router.post('/scan', authenticate, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    const imageUrl = await uploadToLocal(req.file, 'artifact-scans');

    // Mock AI response for local development
    const mockAiData = {
      model: 'artifact-recognition-v2',
      confidence: 0.85 + Math.random() * 0.15,
      tags: ['artifact', 'ancient', 'historical'],
      ocr_text: 'Sample inscription text',
      metadata: { processed: true },
      suggestions: [
        { artifact_type: 'Pottery', confidence: 0.92, era: 'Ancient' },
        { artifact_type: 'Tool', confidence: 0.78, era: 'Bronze Age' }
      ]
    };

    const stmt = db.prepare(`
      INSERT INTO recognition_results (image_url, ai_model, confidence_score, recognized_tags, 
       ocr_text, metadata)
       VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      imageUrl, mockAiData.model, mockAiData.confidence, 
      JSON.stringify(mockAiData.tags), mockAiData.ocr_text, JSON.stringify(mockAiData.metadata)
    );

    const recognition = db.prepare('SELECT * FROM recognition_results WHERE id = ?').get(result.lastInsertRowid);

    res.json({
      recognition,
      suggestions: mockAiData.suggestions,
    });
  } catch (error) {
    next(error);
  }
});

// GET /artifacts
router.get('/', async (req, res, next) => {
  try {
    const { era, origin, material, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, m.name as museum_name
      FROM artifacts a
      LEFT JOIN museums m ON a.museum_id = m.id
      WHERE 1=1
    `;
    const params = [];

    if (era) {
      query += ' AND a.era = ?';
      params.push(era);
    }
    if (origin) {
      query += ' AND a.origin LIKE ?';
      params.push(`%${origin}%`);
    }
    if (material) {
      query += ' AND a.material LIKE ?';
      params.push(`%${material}%`);
    }
    if (search) {
      query += ' AND (a.name LIKE ? OR a.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const artifacts = db.prepare(query).all(...params);
    res.json({ data: artifacts, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
});

// GET /artifacts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const artifact = db.prepare(`
      SELECT a.*, m.name as museum_name, m.location as museum_location
      FROM artifacts a
      LEFT JOIN museums m ON a.museum_id = m.id
      WHERE a.id = ?
    `).get(req.params.id);

    if (!artifact) {
      return res.status(404).json({ error: 'Artifact not found' });
    }

    const images = db.prepare('SELECT * FROM artifact_images WHERE artifact_id = ?').all(req.params.id);
    const categories = db.prepare(`
      SELECT c.* FROM categories c
      JOIN artifact_categories ac ON c.id = ac.category_id
      WHERE ac.artifact_id = ?
    `).all(req.params.id);
    const recognitions = db.prepare('SELECT * FROM recognition_results WHERE artifact_id = ? ORDER BY created_at DESC').all(req.params.id);

    res.json({
      ...artifact,
      images,
      categories,
      recognition_history: recognitions,
    });
  } catch (error) {
    next(error);
  }
});

// POST /artifacts
router.post('/', authenticate, authorize('admin', 'researcher'), upload.single('thumbnail'), async (req, res, next) => {
  try {
    const { error, value } = artifactSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    let thumbnailUrl;
    if (req.file) {
      thumbnailUrl = await uploadToLocal(req.file, 'artifact-thumbnails');
    }

    const stmt = db.prepare(`
      INSERT INTO artifacts (name, origin, age_years, era, material, cultural_significance,
       discovery_site, discovery_date, current_location, museum_id, dimensions, weight_kg,
       condition_status, description, thumbnail_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      value.name, value.origin, value.age_years, value.era, value.material, 
      value.cultural_significance, value.discovery_site, value.discovery_date,
      value.current_location, value.museum_id, value.dimensions, value.weight_kg,
      value.condition_status, value.description, thumbnailUrl, req.user.id
    );

    const artifactId = result.lastInsertRowid;

    if (value.category_ids && value.category_ids.length > 0) {
      const catStmt = db.prepare('INSERT INTO artifact_categories (artifact_id, category_id) VALUES (?, ?)');
      for (const categoryId of value.category_ids) {
        catStmt.run(artifactId, categoryId);
      }
    }

    const artifact = db.prepare('SELECT * FROM artifacts WHERE id = ?').get(artifactId);
    res.status(201).json(artifact);
  } catch (error) {
    next(error);
  }
});

// PUT /artifacts/:id
router.put('/:id', authenticate, authorize('admin', 'researcher'), async (req, res, next) => {
  try {
    const { error, value } = artifactSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const stmt = db.prepare(`
      UPDATE artifacts SET name = ?, origin = ?, age_years = ?, era = ?, material = ?,
       cultural_significance = ?, discovery_site = ?, discovery_date = ?, current_location = ?,
       museum_id = ?, dimensions = ?, weight_kg = ?, condition_status = ?, description = ?,
       updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);

    const result = stmt.run(
      value.name, value.origin, value.age_years, value.era, value.material,
      value.cultural_significance, value.discovery_site, value.discovery_date,
      value.current_location, value.museum_id, value.dimensions, value.weight_kg,
      value.condition_status, value.description, req.params.id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Artifact not found' });
    }

    const artifact = db.prepare('SELECT * FROM artifacts WHERE id = ?').get(req.params.id);
    res.json(artifact);
  } catch (error) {
    next(error);
  }
});

export default router;
