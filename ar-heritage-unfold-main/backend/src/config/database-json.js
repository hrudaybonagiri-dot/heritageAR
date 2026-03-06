import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../data/db.json');
const dbDir = dirname(dbPath);

// Create data directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const adapter = new JSONFile(dbPath);
const defaultData = {
  users: [],
  monuments: [],
  monument_versions: [],
  environmental_risks: [],
  restoration_records: [],
  civilizations: [],
  ar_scenes: [],
  historical_events: [],
  audio_guides: [],
  user_interactions: [],
  museums: [],
  categories: [],
  artifacts: [],
  artifact_categories: [],
  artifact_images: [],
  recognition_results: [],
};

const db = new Low(adapter, defaultData);

// Initialize database
await db.read();
db.data ||= defaultData;
await db.write();

console.log('JSON database initialized');

export default db;
