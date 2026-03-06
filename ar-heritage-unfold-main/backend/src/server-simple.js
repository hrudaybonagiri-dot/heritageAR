import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import authRoutes from './routes/auth-json.js';
import { errorHandler } from './middleware/errorHandler.js';
import { upload } from './middleware/upload.js';
import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);

// Simple test routes
app.get('/api/monuments', (req, res) => {
  res.json({ 
    data: [
      {
        id: 1,
        name: "Colosseum",
        location: "Rome, Italy",
        latitude: 41.8902,
        longitude: 12.4922,
        historical_era: "Ancient Rome",
        architect: "Vespasian",
        materials: "Concrete, stone, brick",
        condition_status: "fair",
        description: "Ancient amphitheater in the center of Rome",
        model_url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
        model_format: "GLTF",
        thumbnail_url: "/uploads/thumbnails/colosseum.jpg",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: "Taj Mahal",
        location: "Agra, India",
        latitude: 27.1751,
        longitude: 78.0421,
        historical_era: "Mughal Empire",
        architect: "Ustad Ahmad Lahauri",
        materials: "White marble, precious stones",
        condition_status: "good",
        description: "Ivory-white marble mausoleum",
        model_url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb",
        model_format: "GLTF",
        thumbnail_url: "/uploads/thumbnails/taj-mahal.jpg",
        created_at: new Date().toISOString()
      }
    ],
    page: 1,
    limit: 10
  });
});

app.get('/api/monuments/:id', (req, res) => {
  const monumentData = {
    1: {
      id: 1,
      name: "Colosseum",
      location: "Rome, Italy",
      latitude: 41.8902,
      longitude: 12.4922,
      historical_era: "Ancient Rome",
      architect: "Vespasian",
      materials: "Concrete, stone, brick",
      condition_status: "fair",
      description: "Ancient amphitheater in the center of Rome",
      model_url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
      model_format: "GLTF",
      thumbnail_url: "/uploads/thumbnails/colosseum.jpg",
      versions: [
        {
          id: 1,
          version_number: 2,
          model_url: "/uploads/models/colosseum-v2.gltf",
          changes_description: "Updated texture quality and added weathering details",
          created_at: new Date().toISOString()
        }
      ],
      environmental_risks: [
        {
          id: 1,
          risk_type: "Climate change",
          severity: "high",
          description: "Increased rainfall causing erosion of stone surfaces",
          recorded_date: "2024-01-10"
        },
        {
          id: 2,
          risk_type: "Air pollution",
          severity: "medium",
          description: "Urban pollution accelerating deterioration",
          recorded_date: "2024-02-15"
        }
      ],
      restoration_records: [
        {
          id: 1,
          restoration_date: "2023-06-01",
          work_performed: "Structural reinforcement of underground chambers",
          cost: 500000.00,
          contractor: "Heritage Restoration Inc",
          before_images: ["/uploads/restorations/colosseum-before-1.jpg"],
          after_images: ["/uploads/restorations/colosseum-after-1.jpg"]
        }
      ]
    }
  };

  const monument = monumentData[req.params.id];
  if (!monument) {
    return res.status(404).json({ error: 'Monument not found' });
  }
  res.json(monument);
});

// POST /monuments - Create new monument with file uploads
app.post('/api/monuments', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'model', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, description, location, historical_era, condition_status, model_url, timestamp } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '../uploads/thumbnails');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    // Handle thumbnail upload
    let thumbnailUrl = '/uploads/thumbnails/monument-' + Date.now() + '.jpg';
    if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
      const thumbnailFile = req.files.thumbnail[0];
      const thumbnailFilename = `monument-${Date.now()}.jpg`;
      const thumbnailPath = path.join(uploadsDir, thumbnailFilename);
      
      await writeFile(thumbnailPath, thumbnailFile.buffer);
      thumbnailUrl = `/uploads/thumbnails/${thumbnailFilename}`;
      console.log('✅ Thumbnail saved:', thumbnailUrl);
    }

    // Handle model upload (if provided)
    let finalModelUrl = model_url || 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
    if (req.files && req.files.model && req.files.model[0]) {
      const modelFile = req.files.model[0];
      const modelsDir = path.join(__dirname, '../uploads/models');
      await mkdir(modelsDir, { recursive: true });
      
      const modelFilename = `monument-${Date.now()}.glb`;
      const modelPath = path.join(modelsDir, modelFilename);
      
      await writeFile(modelPath, modelFile.buffer);
      finalModelUrl = `/uploads/models/${modelFilename}`;
      console.log('✅ Model saved:', finalModelUrl);
    }

    // Create monument object
    const newMonument = {
      id: Date.now(),
      name,
      description,
      location: location || 'Unknown',
      historical_era: historical_era || 'Modern',
      condition_status: condition_status || 'good',
      model_url: finalModelUrl,
      model_format: 'GLTF',
      thumbnail_url: thumbnailUrl,
      created_at: timestamp || new Date().toISOString()
    };

    console.log('✅ New monument created:', newMonument);

    res.status(201).json(newMonument);
  } catch (error) {
    console.error('❌ Error creating monument:', error);
    res.status(500).json({ error: 'Failed to create monument', details: error.message });
  }
});

// Monument Preservation Endpoints
app.get('/api/preservation/versions/:monumentId', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        monument_id: parseInt(req.params.monumentId),
        version_number: 2,
        model_url: "/uploads/models/monument-v2.gltf",
        changes_description: "Updated texture quality and added weathering details",
        created_by_email: "admin@heritage.org",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        monument_id: parseInt(req.params.monumentId),
        version_number: 1,
        model_url: "/uploads/models/monument-v1.gltf",
        changes_description: "Initial 3D scan",
        created_by_email: "admin@heritage.org",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  });
});

app.get('/api/preservation/risks/:monumentId', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        monument_id: parseInt(req.params.monumentId),
        risk_type: "Climate change",
        severity: "high",
        description: "Increased rainfall causing erosion",
        recorded_date: "2024-01-10",
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        monument_id: parseInt(req.params.monumentId),
        risk_type: "Air pollution",
        severity: "medium",
        description: "Urban pollution accelerating deterioration",
        recorded_date: "2024-02-15",
        created_at: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/preservation/risks/summary/:monumentId', (req, res) => {
  res.json({
    summary: [
      { severity: "critical", count: 1, risk_types: ["Structural damage"] },
      { severity: "high", count: 2, risk_types: ["Climate change", "Seismic activity"] },
      { severity: "medium", count: 3, risk_types: ["Air pollution", "Tourism impact", "Vegetation growth"] },
      { severity: "low", count: 1, risk_types: ["Minor weathering"] }
    ]
  });
});

app.get('/api/preservation/restorations/:monumentId', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        monument_id: parseInt(req.params.monumentId),
        restoration_date: "2023-06-01",
        work_performed: "Structural reinforcement of underground chambers",
        cost: 500000.00,
        contractor: "Heritage Restoration Inc",
        before_images: ["/uploads/restorations/before-1.jpg"],
        after_images: ["/uploads/restorations/after-1.jpg"],
        created_at: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/preservation/restorations/stats/:monumentId', (req, res) => {
  res.json({
    total_restorations: 5,
    total_cost: 2500000.00,
    average_cost: 500000.00,
    first_restoration: "2015-03-15",
    last_restoration: "2023-06-01"
  });
});

app.get('/api/preservation/analytics/:monumentId', (req, res) => {
  res.json({
    monument: {
      id: parseInt(req.params.monumentId),
      name: "Colosseum",
      location: "Rome, Italy",
      condition_status: "fair"
    },
    analytics: {
      total_versions: 3,
      environmental_risks: {
        critical: 1,
        high: 2,
        medium: 3,
        low: 1
      },
      restoration_summary: {
        total_restorations: 5,
        total_cost: 2500000.00
      }
    }
  });
});

app.get('/api/preservation/dashboard', (req, res) => {
  res.json({
    monument_conditions: [
      { condition_status: "excellent", count: 5 },
      { condition_status: "good", count: 12 },
      { condition_status: "fair", count: 18 },
      { condition_status: "poor", count: 8 },
      { condition_status: "critical", count: 3 }
    ],
    critical_risks: [
      {
        name: "Colosseum",
        location: "Rome, Italy",
        risk_type: "Structural damage",
        description: "Cracks in foundation detected",
        recorded_date: "2024-02-20"
      }
    ],
    recent_restorations: [
      {
        name: "Taj Mahal",
        location: "Agra, India",
        restoration_date: "2024-01-15",
        work_performed: "Marble cleaning and restoration",
        cost: 750000.00
      }
    ]
  });
});

app.get('/api/experiences', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        name: "Ancient Rome Tour",
        civilization_name: "Roman Empire",
        difficulty_level: "beginner",
        duration_minutes: 30
      }
    ],
    page: 1,
    limit: 10
  });
});

app.get('/api/artifacts', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        name: "Roman Amphora",
        origin: "Rome, Italy",
        era: "Ancient Rome",
        material: "Ceramic",
        age_years: 2000
      }
    ],
    page: 1,
    limit: 10
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    message: 'AR Heritage Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      monuments: 'GET /api/monuments',
      experiences: 'GET /api/experiences',
      artifacts: 'GET /api/artifacts',
      health: 'GET /health'
    }
  });
});

// WebSocket for real-time interactions
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ WebSocket server running on ws://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`\n📝 Authentication:`);
  console.log(`  - POST http://localhost:${PORT}/api/auth/register`);
  console.log(`  - POST http://localhost:${PORT}/api/auth/login`);
  console.log(`\n🏛️  Monuments:`);
  console.log(`  - GET  http://localhost:${PORT}/api/monuments`);
  console.log(`  - GET  http://localhost:${PORT}/api/monuments/:id`);
  console.log(`\n🔧 Monument Preservation:`);
  console.log(`  - GET  http://localhost:${PORT}/api/preservation/versions/:monumentId`);
  console.log(`  - GET  http://localhost:${PORT}/api/preservation/risks/:monumentId`);
  console.log(`  - GET  http://localhost:${PORT}/api/preservation/risks/summary/:monumentId`);
  console.log(`  - GET  http://localhost:${PORT}/api/preservation/restorations/:monumentId`);
  console.log(`  - GET  http://localhost:${PORT}/api/preservation/restorations/stats/:monumentId`);
  console.log(`  - GET  http://localhost:${PORT}/api/preservation/analytics/:monumentId`);
  console.log(`  - GET  http://localhost:${PORT}/api/preservation/dashboard`);
  console.log(`\n🎭 Experiences:`);
  console.log(`  - GET  http://localhost:${PORT}/api/experiences`);
  console.log(`\n🏺 Artifacts:`);
  console.log(`  - GET  http://localhost:${PORT}/api/artifacts`);
  console.log(`\n💚 Health:`);
  console.log(`  - GET  http://localhost:${PORT}/health`);
});

export default app;
