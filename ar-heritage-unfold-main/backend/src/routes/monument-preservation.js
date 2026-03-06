import express from 'express';
import pool from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { uploadToS3 } from '../config/s3.js';
import Joi from 'joi';

const router = express.Router();

// Validation schemas
const versionSchema = Joi.object({
  monument_id: Joi.number().integer().required(),
  version_number: Joi.number().integer().min(1).required(),
  changes_description: Joi.string().required(),
});

const riskSchema = Joi.object({
  monument_id: Joi.number().integer().required(),
  risk_type: Joi.string().required(),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
  description: Joi.string().required(),
  recorded_date: Joi.date().required(),
});

const restorationSchema = Joi.object({
  monument_id: Joi.number().integer().required(),
  restoration_date: Joi.date().required(),
  work_performed: Joi.string().required(),
  cost: Joi.number().min(0),
  contractor: Joi.string(),
});

// ============ MONUMENT VERSIONS ============

// GET /preservation/versions/:monumentId - Get all versions of a monument
router.get('/versions/:monumentId', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT v.*, u.email as created_by_email 
       FROM monument_versions v
       LEFT JOIN users u ON v.created_by = u.id
       WHERE v.monument_id = $1 
       ORDER BY v.version_number DESC`,
      [req.params.monumentId]
    );

    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /preservation/versions - Create new monument version
router.post('/versions', authenticate, authorize('admin'), upload.single('model'), async (req, res, next) => {
  try {
    const { error, value } = versionSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    let modelUrl;
    if (req.file) {
      modelUrl = await uploadToS3(req.file, 'models/versions');
    }

    const result = await pool.query(
      `INSERT INTO monument_versions (monument_id, version_number, model_url, changes_description, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [value.monument_id, value.version_number, modelUrl, value.changes_description, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// GET /preservation/versions/compare/:versionId1/:versionId2 - Compare two versions
router.get('/versions/compare/:versionId1/:versionId2', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM monument_versions WHERE id IN ($1, $2)`,
      [req.params.versionId1, req.params.versionId2]
    );

    if (result.rows.length !== 2) {
      return res.status(404).json({ error: 'One or both versions not found' });
    }

    res.json({
      version1: result.rows[0],
      version2: result.rows[1],
      comparison: {
        time_difference_days: Math.abs(
          (new Date(result.rows[1].created_at) - new Date(result.rows[0].created_at)) / (1000 * 60 * 60 * 24)
        ),
        version_gap: Math.abs(result.rows[1].version_number - result.rows[0].version_number),
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============ ENVIRONMENTAL RISKS ============

// GET /preservation/risks/:monumentId - Get all risks for a monument
router.get('/risks/:monumentId', async (req, res, next) => {
  try {
    const { severity } = req.query;
    
    let query = 'SELECT * FROM environmental_risks WHERE monument_id = $1';
    const params = [req.params.monumentId];

    if (severity) {
      query += ' AND severity = $2';
      params.push(severity);
    }

    query += ' ORDER BY recorded_date DESC, severity DESC';

    const result = await pool.query(query, params);
    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /preservation/risks - Add environmental risk
router.post('/risks', authenticate, authorize('admin', 'researcher'), async (req, res, next) => {
  try {
    const { error, value } = riskSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const result = await pool.query(
      `INSERT INTO environmental_risks (monument_id, risk_type, severity, description, recorded_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [value.monument_id, value.risk_type, value.severity, value.description, value.recorded_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// PUT /preservation/risks/:id - Update environmental risk
router.put('/risks/:id', authenticate, authorize('admin', 'researcher'), async (req, res, next) => {
  try {
    const { risk_type, severity, description, recorded_date } = req.body;

    const result = await pool.query(
      `UPDATE environmental_risks 
       SET risk_type = COALESCE($1, risk_type),
           severity = COALESCE($2, severity),
           description = COALESCE($3, description),
           recorded_date = COALESCE($4, recorded_date)
       WHERE id = $5 RETURNING *`,
      [risk_type, severity, description, recorded_date, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Risk record not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /preservation/risks/:id - Delete environmental risk
router.delete('/risks/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM environmental_risks WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Risk record not found' });
    }

    res.json({ message: 'Risk record deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// GET /preservation/risks/summary/:monumentId - Get risk summary
router.get('/risks/summary/:monumentId', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
         severity,
         COUNT(*) as count,
         array_agg(risk_type) as risk_types
       FROM environmental_risks 
       WHERE monument_id = $1 
       GROUP BY severity
       ORDER BY 
         CASE severity
           WHEN 'critical' THEN 1
           WHEN 'high' THEN 2
           WHEN 'medium' THEN 3
           WHEN 'low' THEN 4
         END`,
      [req.params.monumentId]
    );

    res.json({ summary: result.rows });
  } catch (error) {
    next(error);
  }
});

// ============ RESTORATION RECORDS ============

// GET /preservation/restorations/:monumentId - Get all restoration records
router.get('/restorations/:monumentId', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM restoration_records 
       WHERE monument_id = $1 
       ORDER BY restoration_date DESC`,
      [req.params.monumentId]
    );

    res.json({ data: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /preservation/restorations - Add restoration record
router.post('/restorations', authenticate, authorize('admin', 'researcher'), 
  upload.fields([
    { name: 'before_images', maxCount: 10 },
    { name: 'after_images', maxCount: 10 }
  ]), 
  async (req, res, next) => {
    try {
      const { error, value } = restorationSchema.validate(req.body);
      if (error) throw new Error(error.details[0].message);

      let beforeImages = [];
      let afterImages = [];

      if (req.files?.before_images) {
        beforeImages = await Promise.all(
          req.files.before_images.map(file => uploadToS3(file, 'restorations/before'))
        );
      }

      if (req.files?.after_images) {
        afterImages = await Promise.all(
          req.files.after_images.map(file => uploadToS3(file, 'restorations/after'))
        );
      }

      const result = await pool.query(
        `INSERT INTO restoration_records 
         (monument_id, restoration_date, work_performed, cost, contractor, before_images, after_images)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [value.monument_id, value.restoration_date, value.work_performed, 
         value.cost, value.contractor, beforeImages, afterImages]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      next(error);
    }
});

// PUT /preservation/restorations/:id - Update restoration record
router.put('/restorations/:id', authenticate, authorize('admin', 'researcher'), async (req, res, next) => {
  try {
    const { restoration_date, work_performed, cost, contractor } = req.body;

    const result = await pool.query(
      `UPDATE restoration_records 
       SET restoration_date = COALESCE($1, restoration_date),
           work_performed = COALESCE($2, work_performed),
           cost = COALESCE($3, cost),
           contractor = COALESCE($4, contractor)
       WHERE id = $5 RETURNING *`,
      [restoration_date, work_performed, cost, contractor, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Restoration record not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// GET /preservation/restorations/stats/:monumentId - Get restoration statistics
router.get('/restorations/stats/:monumentId', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT 
         COUNT(*) as total_restorations,
         SUM(cost) as total_cost,
         AVG(cost) as average_cost,
         MIN(restoration_date) as first_restoration,
         MAX(restoration_date) as last_restoration
       FROM restoration_records 
       WHERE monument_id = $1`,
      [req.params.monumentId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// ============ MONUMENT ANALYTICS ============

// GET /preservation/analytics/:monumentId - Get comprehensive monument analytics
router.get('/analytics/:monumentId', async (req, res, next) => {
  try {
    const [monument, versions, risks, restorations] = await Promise.all([
      pool.query('SELECT * FROM monuments WHERE id = $1', [req.params.monumentId]),
      pool.query('SELECT COUNT(*) as count FROM monument_versions WHERE monument_id = $1', [req.params.monumentId]),
      pool.query(
        `SELECT severity, COUNT(*) as count 
         FROM environmental_risks 
         WHERE monument_id = $1 
         GROUP BY severity`,
        [req.params.monumentId]
      ),
      pool.query(
        `SELECT COUNT(*) as count, SUM(cost) as total_cost 
         FROM restoration_records 
         WHERE monument_id = $1`,
        [req.params.monumentId]
      ),
    ]);

    if (monument.rows.length === 0) {
      return res.status(404).json({ error: 'Monument not found' });
    }

    res.json({
      monument: monument.rows[0],
      analytics: {
        total_versions: parseInt(versions.rows[0].count),
        environmental_risks: risks.rows.reduce((acc, row) => {
          acc[row.severity] = parseInt(row.count);
          return acc;
        }, {}),
        restoration_summary: {
          total_restorations: parseInt(restorations.rows[0].count),
          total_cost: parseFloat(restorations.rows[0].total_cost) || 0,
        },
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /preservation/dashboard - Get preservation dashboard data
router.get('/dashboard', authenticate, async (req, res, next) => {
  try {
    const [monumentStats, criticalRisks, recentRestorations] = await Promise.all([
      pool.query(
        `SELECT 
           condition_status,
           COUNT(*) as count
         FROM monuments
         GROUP BY condition_status`
      ),
      pool.query(
        `SELECT m.name, m.location, er.risk_type, er.description, er.recorded_date
         FROM environmental_risks er
         JOIN monuments m ON er.monument_id = m.id
         WHERE er.severity IN ('critical', 'high')
         ORDER BY er.recorded_date DESC
         LIMIT 10`
      ),
      pool.query(
        `SELECT m.name, m.location, rr.restoration_date, rr.work_performed, rr.cost
         FROM restoration_records rr
         JOIN monuments m ON rr.monument_id = m.id
         ORDER BY rr.restoration_date DESC
         LIMIT 10`
      ),
    ]);

    res.json({
      monument_conditions: monumentStats.rows,
      critical_risks: criticalRisks.rows,
      recent_restorations: recentRestorations.rows,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
