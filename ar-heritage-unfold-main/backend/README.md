# AR Heritage Backend

Scalable backend for AR-based cultural heritage platform with monument preservation, immersive experiences, and digital archiving.

## Architecture

```
backend/
├── src/
│   ├── config/          # Database & S3 configuration
│   ├── middleware/      # Auth, upload, error handling
│   ├── routes/          # API endpoints
│   ├── database/        # SQL schema
│   └── server.js        # Express app & WebSocket
├── .env.example
└── package.json
```

## Database Schema

### Monument Preservation
- `monuments` - 3D models, metadata, location
- `monument_versions` - Version control
- `environmental_risks` - Climate tracking
- `restoration_records` - Restoration history

### Immersive Experience
- `civilizations` - Historical civilizations
- `ar_scenes` - AR configurations
- `historical_events` - Timeline events
- `audio_guides` - Multilingual narration
- `user_interactions` - Engagement tracking

### Digital Archiving
- `artifacts` - Artifact metadata
- `artifact_images` - Image gallery
- `recognition_results` - AI recognition
- `categories` - Hierarchical taxonomy
- `museums` - Museum information

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Create PostgreSQL database:
```bash
createdb ar_heritage
```

4. Run migrations:
```bash
psql -U postgres -d ar_heritage -f src/database/schema.sql
```

5. Start server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login

### Monuments
- `GET /api/monuments` - List monuments (filters: era, condition, location)
- `GET /api/monuments/:id` - Get monument details
- `POST /api/monuments` - Create monument (admin)
- `PUT /api/monuments/:id` - Update monument (admin)
- `DELETE /api/monuments/:id` - Delete monument (admin)

### Experiences
- `GET /api/experiences` - List AR scenes
- `GET /api/experiences/:id` - Get scene details
- `GET /api/experiences/civilizations/:id/timeline` - Get timeline
- `POST /api/experiences/user-interactions` - Track interaction
- `POST /api/experiences` - Create scene (admin)

### Artifacts
- `POST /api/artifacts/scan` - AI recognition
- `GET /api/artifacts` - List artifacts (filters: era, origin, material, category)
- `GET /api/artifacts/:id` - Get artifact details
- `POST /api/artifacts` - Create artifact (admin/researcher)
- `PUT /api/artifacts/:id` - Update artifact (admin/researcher)

## Example Requests

### Register User
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securepass123",
  "role": "public_user"
}
```

### Create Monument
```json
POST /api/monuments
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "Colosseum",
  "location": "Rome, Italy",
  "latitude": 41.8902,
  "longitude": 12.4922,
  "historical_era": "Ancient Rome",
  "condition_status": "fair",
  "model_format": "GLTF"
}
```

### Scan Artifact
```json
POST /api/artifacts/scan
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <file>
```

### Track User Interaction
```json
POST /api/experiences/user-interactions
Authorization: Bearer <token>

{
  "ar_scene_id": 1,
  "interaction_type": "view",
  "position_x": 10.5,
  "position_y": 2.3,
  "position_z": 5.1,
  "engagement_time_seconds": 45
}
```

## WebSocket

Real-time event streaming on `ws://localhost:5000`

```javascript
const ws = new WebSocket('ws://localhost:5000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
};
```

## Roles

- `admin` - Full access
- `researcher` - Create/edit artifacts
- `public_user` - View content, track interactions

## Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
```

### Environment Variables
- Production: Set `NODE_ENV=production`
- Use managed PostgreSQL (AWS RDS, DigitalOcean)
- Configure S3 bucket with proper CORS
- Use strong JWT secret
- Enable HTTPS

## Security

- JWT authentication
- Role-based authorization
- Rate limiting (100 req/15min)
- Helmet.js security headers
- Input validation with Joi
- File upload restrictions
