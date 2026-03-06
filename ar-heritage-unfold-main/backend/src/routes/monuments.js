import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToS3 } from '../config/s3.js';
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
    let paramCount = 1;

    if (era) {
      query += ` AND historical_era = $${paramCount++}`;
      params.push(era);
    }
    if (condition) {
      query += ` AND condition_status = $${paramCount++}`;
      params.push(condition);
    }
    if (location) {
      query += ` AND location ILIKE $${paramCount++}`;
      params.push(`%${location}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json({ data: result.rows, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
});

// GET /monuments/:id
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM monuments WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Monument not found' });
    }

    const monument = result.rows[0];

    // Get related data
    const [versions, risks, restorations] = await Promise.all([
      pool.query('SELECT * FROM monument_versions WHERE monument_id = $1 ORDER BY version_number DESC', [req.params.id]),
      pool.query('SELECT * FROM environmental_risks WHERE monument_id = $1 ORDER BY recorded_date DESC', [req.params.id]),
      pool.query('SELECT * FROM restoration_records WHERE monument_id = $1 ORDER BY restoration_date DESC', [req.params.id]),
    ]);

    res.json({
      ...monument,
      versions: versions.rows,
      environmental_risks: risks.rows,
      restoration_records: restorations.rows,
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
      modelUrl = await uploadToS3(req.files.model[0], 'models');
    }
    if (req.files?.thumbnail) {
      thumbnailUrl = await uploadToS3(req.files.thumbnail[0], 'thumbnails');
    }

    const result = await pool.query(
      `INSERT INTO monuments (name, location, latitude, longitude, historical_era, architect, 
       materials, condition_status, description, model_url, model_format, thumbnail_url, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [value.name, value.location, value.latitude, value.longitude, value.historical_era,
       value.architect, value.materials, value.condition_status, value.description,
       modelUrl, value.model_format, thumbnailUrl, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /monuments/:id
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { error, value } = monumentSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const result = await pool.query(
      `UPDATE monuments SET name = $1, location = $2, latitude = $3, longitude = $4,
       historical_era = $5, architect = $6, materials = $7, condition_status = $8,
       description = $9, updated_at = CURRENT_TIMESTAMP WHERE id = $10 RETURNING *`,
      [value.name, value.location, value.latitude, value.longitude, value.historical_era,
       value.architect, value.materials, value.condition_status, value.description, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Monument not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /monuments/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM monuments WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Monument not found' });
    }

    res.json({ message: 'Monument deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
