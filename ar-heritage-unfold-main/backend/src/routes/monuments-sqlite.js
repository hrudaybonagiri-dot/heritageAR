import express from 'express';
import db from '../config/database-sqlite.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToLocal } from '../config/storage.js';
import Joi from 'joi';

const router = express.Router();

const monumentSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90),
  longitude: Joi.number().min(-180).max(180),
  historical_era: Joi.string(),
  architect: Joi.string(),
  materials: Joi.string(),
  condition_status: Joi.string().valid('excellent', 'good', 'fair', 'poor', 'critical'),
  description: Joi.string(),
  model_format: Joi.string().valid('GLTF', 'OBJ', 'FBX'),
});

// GET /monuments
router.get('/', async (req, res, next) => {
  try {
    const { era, condition, location, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM monuments WHERE 1=1';
    const params = [];

    if (era) {
      query += ' AND historical_era = ?';
      params.push(era);
    }
    if (condition) {
      query += ' AND condition_status = ?';
      params.push(condition);
    }
    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const monuments = db.prepare(query).all(...params);
    res.json({ data: monuments, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
});

// GET /monuments/:id
router.get('/:id', async (req, res, next) => {
  try {
    const monument = db.prepare('SELECT * FROM monuments WHERE id = ?').get(req.params.id);
    
    if (!monument) {
      return res.status(404).json({ error: 'Monument not found' });
    }

    const versions = db.prepare('SELECT * FROM monument_versions WHERE monument_id = ? ORDER BY version_number DESC').all(req.params.id);
    const risks = db.prepare('SELECT * FROM environmental_risks WHERE monument_id = ? ORDER BY recorded_date DESC').all(req.params.id);
    const restorations = db.prepare('SELECT * FROM restoration_records WHERE monument_id = ? ORDER BY restoration_date DESC').all(req.params.id);

    res.json({
      ...monument,
      versions,
      environmental_risks: risks,
      restoration_records: restorations,
    });
  } catch (error) {
    next(error);
  }
});

// POST /monuments
router.post('/', authenticate, authorize('admin'), upload.fields([
  { name: 'model', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const { error, value } = monumentSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    let modelUrl, thumbnailUrl;

    if (req.files?.model) {
      modelUrl = await uploadToLocal(req.files.model[0], 'models');
    }
    if (req.files?.thumbnail) {
      thumbnailUrl = await uploadToLocal(req.files.thumbnail[0], 'thumbnails');
    }

    const stmt = db.prepare(`
      INSERT INTO monuments (name, location, latitude, longitude, historical_era, architect, 
       materials, condition_status, description, model_url, model_format, thumbnail_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      value.name, value.location, value.latitude, value.longitude, value.historical_era,
      value.architect, value.materials, value.condition_status, value.description,
      modelUrl, value.model_format, thumbnailUrl, req.user.id
    );

    const monument = db.prepare('SELECT * FROM monuments WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(monument);
  } catch (error) {
    next(error);
  }
});

// PUT /monuments/:id
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { error, value } = monumentSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const stmt = db.prepare(`
      UPDATE monuments SET name = ?, location = ?, latitude = ?, longitude = ?,
       historical_era = ?, architect = ?, materials = ?, condition_status = ?,
       description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);

    const result = stmt.run(
      value.name, value.location, value.latitude, value.longitude, value.historical_era,
      value.architect, value.materials, value.condition_status, value.description, req.params.id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Monument not found' });
    }

    const monument = db.prepare('SELECT * FROM monuments WHERE id = ?').get(req.params.id);
    res.json(monument);
  } catch (error) {
    next(error);
  }
});

// DELETE /monuments/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const stmt = db.prepare('DELETE FROM monuments WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Monument not found' });
    }

    res.json({ message: 'Monument deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
