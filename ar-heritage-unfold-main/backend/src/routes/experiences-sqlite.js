import express from 'express';
import db from '../config/database-sqlite.js';
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

    if (civilization) {
      query += ' AND c.name LIKE ?';
      params.push(`%${civilization}%`);
    }
    if (difficulty) {
      query += ' AND s.difficulty_level = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const scenes = db.prepare(query).all(...params);
    res.json({ data: scenes, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
});

// GET /experiences/:id
router.get('/:id', async (req, res, next) => {
  try {
    const scene = db.prepare(`
      SELECT s.*, c.name as civilization_name, c.region, c.start_year, c.end_year
      FROM ar_scenes s
      JOIN civilizations c ON s.civilization_id = c.id
      WHERE s.id = ?
    `).get(req.params.id);

    if (!scene) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    const events = db.prepare('SELECT * FROM historical_events WHERE ar_scene_id = ? ORDER BY event_year').all(req.params.id);
    const audioGuides = db.prepare('SELECT * FROM audio_guides WHERE ar_scene_id = ?').all(req.params.id);

    res.json({
      ...scene,
      historical_events: events,
      audio_guides: audioGuides,
    });
  } catch (error) {
    next(error);
  }
});

// GET /civilizations/:id/timeline
router.get('/civilizations/:id/timeline', async (req, res, next) => {
  try {
    const events = db.prepare(`
      SELECT * FROM historical_events 
      WHERE civilization_id = ? 
      ORDER BY event_year ASC
    `).all(req.params.id);

    res.json(events);
  } catch (error) {
    next(error);
  }
});

// POST /user-interactions
router.post('/user-interactions', authenticate, async (req, res, next) => {
  try {
    const { ar_scene_id, interaction_type, position_x, position_y, position_z, engagement_time_seconds, interaction_data } = req.body;

    const stmt = db.prepare(`
      INSERT INTO user_interactions (user_id, ar_scene_id, interaction_type, position_x, position_y, 
       position_z, engagement_time_seconds, interaction_data)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      req.user.id, ar_scene_id, interaction_type, position_x, position_y, position_z, 
      engagement_time_seconds, JSON.stringify(interaction_data)
    );

    const interaction = db.prepare('SELECT * FROM user_interactions WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(interaction);
  } catch (error) {
    next(error);
  }
});

// POST /experiences (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { error, value } = arSceneSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const stmt = db.prepare(`
      INSERT INTO ar_scenes (civilization_id, name, description, scene_config, anchor_data, 
       duration_minutes, difficulty_level)
       VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      value.civilization_id, value.name, value.description, 
      JSON.stringify(value.scene_config), JSON.stringify(value.anchor_data),
      value.duration_minutes, value.difficulty_level
    );

    const scene = db.prepare('SELECT * FROM ar_scenes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(scene);
  } catch (error) {
    next(error);
  }
});

export default router;
