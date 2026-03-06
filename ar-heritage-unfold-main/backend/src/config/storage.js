import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads');

// Create upload directories
const folders = ['models', 'thumbnails', 'artifact-scans', 'artifact-thumbnails'];
folders.forEach(folder => {
  const folderPath = path.join(uploadDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
});

export const uploadToLocal = async (file, folder) => {
  const filename = `${Date.now()}-${file.originalname}`;
  const filepath = path.join(uploadDir, folder, filename);
  
  fs.writeFileSync(filepath, file.buffer);
  
  // Return relative URL
  return `/uploads/${folder}/${filename}`;
};

export default { uploadToLocal };
