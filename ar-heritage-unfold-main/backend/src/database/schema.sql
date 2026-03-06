-- Users and Authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'public_user' CHECK (role IN ('admin', 'researcher', 'public_user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Monument Preservation
CREATE TABLE monuments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  historical_era VARCHAR(100),
  architect VARCHAR(255),
  materials TEXT,
  condition_status VARCHAR(50) CHECK (condition_status IN ('excellent', 'good', 'fair', 'poor', 'critical')),
  description TEXT,
  model_url VARCHAR(500),
  model_format VARCHAR(10) CHECK (model_format IN ('GLTF', 'OBJ', 'FBX')),
  thumbnail_url VARCHAR(500),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE monument_versions (
  id SERIAL PRIMARY KEY,
  monument_id INTEGER REFERENCES monuments(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  model_url VARCHAR(500),
  changes_description TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE environmental_risks (
  id SERIAL PRIMARY KEY,
  monument_id INTEGER REFERENCES monuments(id) ON DELETE CASCADE,
  risk_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  recorded_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restoration_records (
  id SERIAL PRIMARY KEY,
  monument_id INTEGER REFERENCES monuments(id) ON DELETE CASCADE,
  restoration_date DATE NOT NULL,
  work_performed TEXT,
  cost DECIMAL(12, 2),
  contractor VARCHAR(255),
  before_images TEXT[],
  after_images TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Immersive Experience
CREATE TABLE civilizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(255),
  start_year INTEGER,
  end_year INTEGER,
  description TEXT,
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ar_scenes (
  id SERIAL PRIMARY KEY,
  civilization_id INTEGER REFERENCES civilizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  scene_config JSONB,
  anchor_data JSONB,
  duration_minutes INTEGER,
  difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE historical_events (
  id SERIAL PRIMARY KEY,
  civilization_id INTEGER REFERENCES civilizations(id) ON DELETE CASCADE,
  ar_scene_id INTEGER REFERENCES ar_scenes(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_year INTEGER,
  event_date DATE,
  significance TEXT,
  media_urls TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audio_guides (
  id SERIAL PRIMARY KEY,
  ar_scene_id INTEGER REFERENCES ar_scenes(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL,
  audio_url VARCHAR(500),
  transcript TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_interactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  ar_scene_id INTEGER REFERENCES ar_scenes(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50),
  position_x DECIMAL(10, 6),
  position_y DECIMAL(10, 6),
  position_z DECIMAL(10, 6),
  engagement_time_seconds INTEGER,
  interaction_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Digital Archiving
CREATE TABLE museums (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  website VARCHAR(255),
  contact_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artifacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  origin VARCHAR(255),
  age_years INTEGER,
  era VARCHAR(100),
  material VARCHAR(255),
  cultural_significance TEXT,
  discovery_site VARCHAR(255),
  discovery_date DATE,
  current_location VARCHAR(255),
  museum_id INTEGER REFERENCES museums(id) ON DELETE SET NULL,
  dimensions VARCHAR(100),
  weight_kg DECIMAL(10, 2),
  condition_status VARCHAR(50),
  description TEXT,
  thumbnail_url VARCHAR(500),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artifact_categories (
  artifact_id INTEGER REFERENCES artifacts(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (artifact_id, category_id)
);

CREATE TABLE artifact_images (
  id SERIAL PRIMARY KEY,
  artifact_id INTEGER REFERENCES artifacts(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  image_type VARCHAR(50) CHECK (image_type IN ('primary', 'detail', 'scan', 'xray')),
  caption TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recognition_results (
  id SERIAL PRIMARY KEY,
  artifact_id INTEGER REFERENCES artifacts(id) ON DELETE CASCADE,
  image_url VARCHAR(500),
  ai_model VARCHAR(100),
  confidence_score DECIMAL(5, 4),
  recognized_tags TEXT[],
  ocr_text TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_monuments_location ON monuments(location);
CREATE INDEX idx_monuments_era ON monuments(historical_era);
CREATE INDEX idx_artifacts_origin ON artifacts(origin);
CREATE INDEX idx_artifacts_era ON artifacts(era);
CREATE INDEX idx_user_interactions_scene ON user_interactions(ar_scene_id);
CREATE INDEX idx_user_interactions_user ON user_interactions(user_id);
CREATE INDEX idx_historical_events_civilization ON historical_events(civilization_id);
