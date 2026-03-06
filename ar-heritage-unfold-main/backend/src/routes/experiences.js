import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import Joi from 'joi';

const router = express.Router();

const arSceneSchema = Joi.object({
  civilization_id: Joi.number().required(),
  name: Joi.string().required(),
  description: Joi.string(),
  scene_config: Joi.object(),
  anchor_data: Joi.object(),
  duration_minutes: Joi.number(),
  difficulty_level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
});

// GET /experiences
router.get('/', async (req, res, next) => {
  try {
    const { civilization, difficulty, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*, c.name as civilization_name, c.region
      FROM ar_scenes s
      JOIN civilizations c ON s.civilization_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    if (civilization) {
      query += ` AND c.name ILIKE $${paramCount++}`;
      params.push(`%${civilization}%`);
    }
    if (difficulty) {
      query += ` AND s.difficulty_level = $${paramCount++}`;
      params.push(difficulty);
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.json({ data: result.rows, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
});

// GET /experiences/:id
router.get('/:id', async (req, res, next) => {
  try {
    const sceneResult = await pool.query(`
      SELECT s.*, c.name as civilization_name, c.region, c.start_year, c.end_year
      FROM ar_scenes s
      JOIN civilizations c ON s.civilization_id = c.id
      WHERE s.id = $1
    `, [req.params.id]);

    if (sceneResult.rows.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    const scene = sceneResult.rows[0];

    const [events, audioGuides] = await Promise.all([
      pool.query('SELECT * FROM historical_events WHERE ar_scene_id = $1 ORDER BY event_year', [req.params.id]),
      pool.query('SELECT * FROM audio_guides WHERE ar_scene_id = $1', [req.params.id]),
    ]);

    res.json({
      ...scene,
      historical_events: events.rows,
      audio_guides: audioGuides.rows,
    });
  } catch (error) {
    next(error);
  }
});

// GET /civilizations/:id/timeline
router.get('/civilizations/:id/timeline', async (req, res, next) => {
  try {
    const events = await pool.query(`
      SELECT * FROM historical_events 
      WHERE civilization_id = $1 
      ORDER BY event_year ASC
    `, [req.params.id]);

    res.json(events.rows);
  } catch (error) {
    next(error);
  }
});

// POST /user-interactions
router.post('/user-interactions', authenticate, async (req, res, next) => {
  try {
    const { ar_scene_id, interaction_type, position_x, position_y, position_z, engagement_time_seconds, interaction_data } = req.body;

    const result = await pool.query(
      `INSERT INTO user_interactions (user_id, ar_scene_id, interaction_type, position_x, position_y, 
       position_z, engagement_time_seconds, interaction_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.id, ar_scene_id, interaction_type, position_x, position_y, position_z, 
       engagement_time_seconds, interaction_data]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /experiences (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { error, value } = arSceneSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const result = await pool.query(
      `INSERT INTO ar_scenes (civilization_id, name, description, scene_config, anchor_data, 
       duration_minutes, difficulty_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [value.civilization_id, value.name, value.description, value.scene_config, 
       value.anchor_data, value.duration_minutes, value.difficulty_level]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
