import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../data/ar_heritage.db');
const dbDir = dirname(dbPath);

// Create data directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize database schema
const initSchema = () => {
  db.exec(`
    -- Users
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'public_user' CHECK (role IN ('admin', 'researcher', 'public_user')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Monuments
    CREATE TABLE IF NOT EXISTS monuments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      historical_era TEXT,
      architect TEXT,
      materials TEXT,
      condition_status TEXT CHECK (condition_status IN ('excellent', 'good', 'fair', 'poor', 'critical')),
      description TEXT,
      model_url TEXT,
      model_format TEXT CHECK (model_format IN ('GLTF', 'OBJ', 'FBX')),
      thumbnail_url TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_monuments_location ON monuments(location);
    CREATE INDEX IF NOT EXISTS idx_monuments_era ON monuments(historical_era);

    -- Monument Versions
    CREATE TABLE IF NOT EXISTS monument_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      monument_id INTEGER REFERENCES monuments(id) ON DELETE CASCADE,
      version_number INTEGER NOT NULL,
      model_url TEXT,
      changes_description TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Environmental Risks
    CREATE TABLE IF NOT EXISTS environmental_risks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      monument_id INTEGER REFERENCES monuments(id) ON DELETE CASCADE,
      risk_type TEXT NOT NULL,
      severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
      description TEXT,
      recorded_date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Restoration Records
    CREATE TABLE IF NOT EXISTS restoration_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      monument_id INTEGER REFERENCES monuments(id) ON DELETE CASCADE,
      restoration_date DATE NOT NULL,
      work_performed TEXT,
      cost REAL,
      contractor TEXT,
      before_images TEXT,
      after_images TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Civilizations
    CREATE TABLE IF NOT EXISTS civilizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      region TEXT,
      start_year INTEGER,
      end_year INTEGER,
      description TEXT,
      thumbnail_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- AR Scenes
    CREATE TABLE IF NOT EXISTS ar_scenes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      civilization_id INTEGER REFERENCES civilizations(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      description TEXT,
      scene_config TEXT,
      anchor_data TEXT,
      duration_minutes INTEGER,
      difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Historical Events
    CREATE TABLE IF NOT EXISTS historical_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      civilization_id INTEGER REFERENCES civilizations(id) ON DELETE CASCADE,
      ar_scene_id INTEGER REFERENCES ar_scenes(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      description TEXT,
      event_year INTEGER,
      event_date DATE,
      significance TEXT,
      media_urls TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_historical_events_civilization ON historical_events(civilization_id);

    -- Audio Guides
    CREATE TABLE IF NOT EXISTS audio_guides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ar_scene_id INTEGER REFERENCES ar_scenes(id) ON DELETE CASCADE,
      language TEXT NOT NULL,
      audio_url TEXT,
      transcript TEXT,
      duration_seconds INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- User Interactions
    CREATE TABLE IF NOT EXISTS user_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      ar_scene_id INTEGER REFERENCES ar_scenes(id) ON DELETE CASCADE,
      interaction_type TEXT,
      position_x REAL,
      position_y REAL,
      position_z REAL,
      engagement_time_seconds INTEGER,
      interaction_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_user_interactions_scene ON user_interactions(ar_scene_id);
    CREATE INDEX IF NOT EXISTS idx_user_interactions_user ON user_interactions(user_id);

    -- Museums
    CREATE TABLE IF NOT EXISTS museums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      website TEXT,
      contact_email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Categories
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Artifacts
    CREATE TABLE IF NOT EXISTS artifacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      origin TEXT,
      age_years INTEGER,
      era TEXT,
      material TEXT,
      cultural_significance TEXT,
      discovery_site TEXT,
      discovery_date DATE,
      current_location TEXT,
      museum_id INTEGER REFERENCES museums(id) ON DELETE SET NULL,
      dimensions TEXT,
      weight_kg REAL,
      condition_status TEXT,
      description TEXT,
      thumbnail_url TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_artifacts_origin ON artifacts(origin);
    CREATE INDEX IF NOT EXISTS idx_artifacts_era ON artifacts(era);

    -- Artifact Categories (Many-to-Many)
    CREATE TABLE IF NOT EXISTS artifact_categories (
      artifact_id INTEGER REFERENCES artifacts(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
      PRIMARY KEY (artifact_id, category_id)
    );

    -- Artifact Images
    CREATE TABLE IF NOT EXISTS artifact_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      artifact_id INTEGER REFERENCES artifacts(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      image_type TEXT CHECK (image_type IN ('primary', 'detail', 'scan', 'xray')),
      caption TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Recognition Results
    CREATE TABLE IF NOT EXISTS recognition_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      artifact_id INTEGER REFERENCES artifacts(id) ON DELETE CASCADE,
      image_url TEXT,
      ai_model TEXT,
      confidence_score REAL,
      recognized_tags TEXT,
      ocr_text TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Database schema initialized');
};

initSchema();

export default db;
