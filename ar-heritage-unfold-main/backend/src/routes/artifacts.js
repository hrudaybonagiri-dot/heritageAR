import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToS3 } from '../config/s3.js';
import Joi from 'joi';
import fetch from 'node-fetch';

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

// POST /artifacts/scan - AI-powered artifact recognition
router.post('/scan', authenticate, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file required' });
    }

    const imageUrl = await uploadToS3(req.file, 'artifact-scans');

    // Call AI recognition API
    const aiResponse = await fetch(process.env.AI_RECOGNITION_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AI_RECOGNITION_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    const aiData = await aiResponse.json();

    // Store recognition result
    const result = await pool.query(
      `INSERT INTO recognition_results (image_url, ai_model, confidence_score, recognized_tags, 
       ocr_text, metadata)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [imageUrl, aiData.model || 'default', aiData.confidence, aiData.tags, 
       aiData.ocr_text, aiData.metadata]
    );

    res.json({
      recognition: result.rows[0],
      suggestions: aiData.suggestions || [],
    });
  } catch (error) {
    next(error);
  }
});

// GET /artifacts
router.get('/', async (req, res, next) => {
  try {
    const { era, origin, material, category, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT DISTINCT a.*, m.name as museum_name,
      ARRAY_AGG(DISTINCT c.name) as categories
      FROM artifacts a
      LEFT JOIN museums m ON a.museum_id = m.id
      LEFT JOIN artifact_categories ac ON a.id = ac.artifact_id
      LEFT JOIN categories c ON ac.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (era) {
      query += ` AND a.era = $${paramCount++}`;
      params.push(era);
    }
    if (origin) {
      query += ` AND a.origin ILIKE $${paramCount++}`;
      params.push(`%${origin}%`);
    }
    if (material) {
      query += ` AND a.material ILIKE $${paramCount++}`;
      params.push(`%${material}%`);
    }
    if (category) {
      query += ` AND c.name = $${paramCount++}`;
      params.push(category);
    }
    if (search) {
      query += ` AND (a.name ILIKE $${paramCount} OR a.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` GROUP BY a.id, m.name ORDER BY a.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json({ data: result.rows, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
});

// GET /artifacts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const artifactResult = await pool.query(`
      SELECT a.*, m.name as museum_name, m.location as museum_location
      FROM artifacts a
      LEFT JOIN museums m ON a.museum_id = m.id
      WHERE a.id = $1
    `, [req.params.id]);

    if (artifactResult.rows.length === 0) {
      return res.status(404).json({ error: 'Artifact not found' });
    }

    const artifact = artifactResult.rows[0];

    const [images, categories, recognitions] = await Promise.all([
      pool.query('SELECT * FROM artifact_images WHERE artifact_id = $1', [req.params.id]),
      pool.query(`
        SELECT c.* FROM categories c
        JOIN artifact_categories ac ON c.id = ac.category_id
        WHERE ac.artifact_id = $1
      `, [req.params.id]),
      pool.query('SELECT * FROM recognition_results WHERE artifact_id = $1 ORDER BY created_at DESC', [req.params.id]),
    ]);

    res.json({
      ...artifact,
      images: images.rows,
      categories: categories.rows,
      recognition_history: recognitions.rows,
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
      thumbnailUrl = await uploadToS3(req.file, 'artifact-thumbnails');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO artifacts (name, origin, age_years, era, material, cultural_significance,
         discovery_site, discovery_date, current_location, museum_id, dimensions, weight_kg,
         condition_status, description, thumbnail_url, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
        [value.name, value.origin, value.age_years, value.era, value.material, 
         value.cultural_significance, value.discovery_site, value.discovery_date,
         value.current_location, value.museum_id, value.dimensions, value.weight_kg,
         value.condition_status, value.description, thumbnailUrl, req.user.id]
      );

      const artifactId = result.rows[0].id;

      if (value.category_ids && value.category_ids.length > 0) {
        for (const categoryId of value.category_ids) {
          await client.query(
            'INSERT INTO artifact_categories (artifact_id, category_id) VALUES ($1, $2)',
            [artifactId, categoryId]
          );
        }
      }

      await client.query('COMMIT');
      res.status(201).json(result.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    next(error);
  }
});

// PUT /artifacts/:id
router.put('/:id', authenticate, authorize('admin', 'researcher'), async (req, res, next) => {
  try {
    const { error, value } = artifactSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const result = await pool.query(
      `UPDATE artifacts SET name = $1, origin = $2, age_years = $3, era = $4, material = $5,
       cultural_significance = $6, discovery_site = $7, discovery_date = $8, current_location = $9,
       museum_id = $10, dimensions = $11, weight_kg = $12, condition_status = $13, description = $14,
       updated_at = CURRENT_TIMESTAMP WHERE id = $15 RETURNING *`,
      [value.name, value.origin, value.age_years, value.era, value.material,
       value.cultural_significance, value.discovery_site, value.discovery_date,
       value.current_location, value.museum_id, value.dimensions, value.weight_kg,
       value.condition_status, value.description, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artifact not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
