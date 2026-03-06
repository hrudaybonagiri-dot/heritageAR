# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "public_user"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "public_user",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "public_user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Monument Endpoints

### List Monuments
```http
GET /monuments?era=Ancient Rome&condition=fair&page=1&limit=10
```

**Query Parameters:**
- `era` (optional) - Filter by historical era
- `condition` (optional) - Filter by condition status
- `location` (optional) - Filter by location (partial match)
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Colosseum",
      "location": "Rome, Italy",
      "latitude": 41.8902,
      "longitude": 12.4922,
      "historical_era": "Ancient Rome",
      "architect": "Vespasian",
      "materials": "Concrete, stone, brick",
      "condition_status": "fair",
      "description": "Ancient amphitheater...",
      "model_url": "https://s3.amazonaws.com/...",
      "model_format": "GLTF",
      "thumbnail_url": "https://s3.amazonaws.com/...",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10
}
```

### Get Monument Details
```http
GET /monuments/:id
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Colosseum",
  "location": "Rome, Italy",
  "versions": [
    {
      "id": 1,
      "version_number": 2,
      "model_url": "https://s3.amazonaws.com/...",
      "changes_description": "Updated texture quality",
      "created_at": "2024-01-15T00:00:00.000Z"
    }
  ],
  "environmental_risks": [
    {
      "id": 1,
      "risk_type": "Climate change",
      "severity": "high",
      "description": "Increased rainfall causing erosion",
      "recorded_date": "2024-01-10"
    }
  ],
  "restoration_records": [
    {
      "id": 1,
      "restoration_date": "2023-06-01",
      "work_performed": "Structural reinforcement",
      "cost": 500000.00,
      "contractor": "Heritage Restoration Inc"
    }
  ]
}
```

### Create Monument
```http
POST /monuments
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (required)
- `location` (required)
- `latitude` (optional)
- `longitude` (optional)
- `historical_era` (optional)
- `architect` (optional)
- `materials` (optional)
- `condition_status` (optional): excellent|good|fair|poor|critical
- `description` (optional)
- `model_format` (optional): GLTF|OBJ|FBX
- `model` (file, optional)
- `thumbnail` (file, optional)

**Response (201):**
```json
{
  "id": 1,
  "name": "Colosseum",
  "location": "Rome, Italy",
  "model_url": "https://s3.amazonaws.com/...",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Update Monument
```http
PUT /monuments/:id
Authorization: Bearer <admin_token>
```

**Request Body:** Same as Create Monument (without files)

### Delete Monument
```http
DELETE /monuments/:id
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "Monument deleted successfully"
}
```

---

## Experience Endpoints

### List AR Experiences
```http
GET /experiences?civilization=Ancient Egypt&difficulty=beginner&page=1&limit=10
```

**Query Parameters:**
- `civilization` (optional)
- `difficulty` (optional): beginner|intermediate|advanced
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "civilization_id": 1,
      "civilization_name": "Ancient Egypt",
      "region": "North Africa",
      "name": "Pyramid Construction",
      "description": "Experience building the Great Pyramid",
      "scene_config": {...},
      "anchor_data": {...},
      "duration_minutes": 30,
      "difficulty_level": "beginner"
    }
  ],
  "page": 1,
  "limit": 10
}
```

### Get Experience Details
```http
GET /experiences/:id
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Pyramid Construction",
  "civilization_name": "Ancient Egypt",
  "historical_events": [
    {
      "id": 1,
      "title": "Foundation Laying",
      "description": "Workers begin laying foundation stones",
      "event_year": -2580,
      "significance": "Start of construction"
    }
  ],
  "audio_guides": [
    {
      "id": 1,
      "language": "en",
      "audio_url": "https://s3.amazonaws.com/...",
      "duration_seconds": 180
    }
  ]
}
```

### Get Civilization Timeline
```http
GET /experiences/civilizations/:id/timeline
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Unification of Egypt",
    "event_year": -3100,
    "description": "Narmer unifies Upper and Lower Egypt"
  },
  {
    "id": 2,
    "title": "Great Pyramid Built",
    "event_year": -2560,
    "description": "Construction of Khufu's pyramid"
  }
]
```

### Track User Interaction
```http
POST /experiences/user-interactions
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "ar_scene_id": 1,
  "interaction_type": "view",
  "position_x": 10.5,
  "position_y": 2.3,
  "position_z": 5.1,
  "engagement_time_seconds": 45,
  "interaction_data": {
    "action": "examined_artifact",
    "artifact_id": 123
  }
}
```

**Response (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "ar_scene_id": 1,
  "interaction_type": "view",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

## Artifact Endpoints

### Scan Artifact (AI Recognition)
```http
POST /artifacts/scan
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `image` (file, required)

**Response (200):**
```json
{
  "recognition": {
    "id": 1,
    "image_url": "https://s3.amazonaws.com/...",
    "ai_model": "artifact-recognition-v2",
    "confidence_score": 0.92,
    "recognized_tags": ["pottery", "ancient", "ceramic"],
    "ocr_text": "Made in Athens 450 BC",
    "metadata": {...}
  },
  "suggestions": [
    {
      "artifact_type": "Greek Amphora",
      "confidence": 0.92,
      "era": "Classical Period"
    }
  ]
}
```

### List Artifacts
```http
GET /artifacts?era=Ancient Greece&origin=Athens&material=ceramic&category=pottery&search=vase&page=1&limit=10
```

**Query Parameters:**
- `era` (optional)
- `origin` (optional)
- `material` (optional)
- `category` (optional)
- `search` (optional) - Search in name and description
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Red-Figure Amphora",
      "origin": "Athens, Greece",
      "age_years": 2500,
      "era": "Classical Period",
      "material": "Ceramic",
      "cultural_significance": "Depicts Olympic games",
      "discovery_site": "Acropolis",
      "museum_name": "National Archaeological Museum",
      "categories": ["pottery", "ceremonial"],
      "thumbnail_url": "https://s3.amazonaws.com/..."
    }
  ],
  "page": 1,
  "limit": 10
}
```

### Get Artifact Details
```http
GET /artifacts/:id
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Red-Figure Amphora",
  "origin": "Athens, Greece",
  "age_years": 2500,
  "era": "Classical Period",
  "material": "Ceramic",
  "dimensions": "45cm x 30cm",
  "weight_kg": 5.2,
  "condition_status": "good",
  "description": "Well-preserved amphora...",
  "museum_name": "National Archaeological Museum",
  "images": [
    {
      "id": 1,
      "image_url": "https://s3.amazonaws.com/...",
      "image_type": "primary",
      "caption": "Front view"
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "pottery"
    }
  ],
  "recognition_history": [
    {
      "id": 1,
      "confidence_score": 0.92,
      "recognized_tags": ["pottery", "ancient"],
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Artifact
```http
POST /artifacts
Authorization: Bearer <admin_or_researcher_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (required)
- `origin` (optional)
- `age_years` (optional)
- `era` (optional)
- `material` (optional)
- `cultural_significance` (optional)
- `discovery_site` (optional)
- `discovery_date` (optional)
- `current_location` (optional)
- `museum_id` (optional)
- `dimensions` (optional)
- `weight_kg` (optional)
- `condition_status` (optional)
- `description` (optional)
- `category_ids` (optional, array)
- `thumbnail` (file, optional)

**Response (201):**
```json
{
  "id": 1,
  "name": "Red-Figure Amphora",
  "origin": "Athens, Greece",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Update Artifact
```http
PUT /artifacts/:id
Authorization: Bearer <admin_or_researcher_token>
```

**Request Body:** Same as Create Artifact (without files)

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```
