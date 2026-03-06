# Monument Preservation API Documentation

## Overview

The Monument Preservation API provides comprehensive endpoints for creating and managing detailed 3D digital twins of historical monuments. This system protects cultural heritage against time, climate, and conflict through version control, environmental risk tracking, and restoration management.

## Base URL
```
http://localhost:5000/api
```

---

## Core Features

1. **3D Digital Twin Versioning** - Track multiple versions of monument 3D models
2. **Environmental Risk Management** - Monitor climate, pollution, and other threats
3. **Restoration Records** - Document all restoration work with before/after imagery
4. **Analytics Dashboard** - Comprehensive preservation insights

---

## Monument Endpoints

### List All Monuments
```http
GET /monuments?era=Ancient Rome&condition=fair&location=Rome&page=1&limit=10
```

**Query Parameters:**
- `era` (optional) - Filter by historical era
- `condition` (optional) - Filter by condition: excellent|good|fair|poor|critical
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
      "description": "Ancient amphitheater in the center of Rome",
      "model_url": "/uploads/models/colosseum.gltf",
      "model_format": "GLTF",
      "thumbnail_url": "/uploads/thumbnails/colosseum.jpg",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10
}
```

### Get Monument Details with Full History
```http
GET /monuments/:id
```

**Response (200):**
```json
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
  "description": "Ancient amphitheater in the center of Rome",
  "model_url": "/uploads/models/colosseum.gltf",
  "model_format": "GLTF",
  "thumbnail_url": "/uploads/thumbnails/colosseum.jpg",
  "versions": [
    {
      "id": 1,
      "version_number": 2,
      "model_url": "/uploads/models/colosseum-v2.gltf",
      "changes_description": "Updated texture quality and added weathering details",
      "created_at": "2024-01-15T00:00:00.000Z"
    }
  ],
  "environmental_risks": [
    {
      "id": 1,
      "risk_type": "Climate change",
      "severity": "high",
      "description": "Increased rainfall causing erosion of stone surfaces",
      "recorded_date": "2024-01-10"
    }
  ],
  "restoration_records": [
    {
      "id": 1,
      "restoration_date": "2023-06-01",
      "work_performed": "Structural reinforcement of underground chambers",
      "cost": 500000.00,
      "contractor": "Heritage Restoration Inc",
      "before_images": ["/uploads/restorations/colosseum-before-1.jpg"],
      "after_images": ["/uploads/restorations/colosseum-after-1.jpg"]
    }
  ]
}
```

---

## Version Control Endpoints

### Get All Versions of a Monument
```http
GET /preservation/versions/:monumentId
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "monument_id": 1,
      "version_number": 2,
      "model_url": "/uploads/models/colosseum-v2.gltf",
      "changes_description": "Updated texture quality and added weathering details",
      "created_by_email": "admin@heritage.org",
      "created_at": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": 2,
      "monument_id": 1,
      "version_number": 1,
      "model_url": "/uploads/models/colosseum-v1.gltf",
      "changes_description": "Initial 3D scan",
      "created_by_email": "admin@heritage.org",
      "created_at": "2023-12-01T00:00:00.000Z"
    }
  ]
}
```

### Create New Monument Version
```http
POST /preservation/versions
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `monument_id` (required) - Monument ID
- `version_number` (required) - Version number (integer)
- `changes_description` (required) - Description of changes
- `model` (file, optional) - 3D model file (GLTF, OBJ, FBX)

**Response (201):**
```json
{
  "id": 3,
  "monument_id": 1,
  "version_number": 3,
  "model_url": "/uploads/models/versions/colosseum-v3.gltf",
  "changes_description": "Added interior details and lighting",
  "created_by": 1,
  "created_at": "2024-02-20T00:00:00.000Z"
}
```

### Compare Two Versions
```http
GET /preservation/versions/compare/:versionId1/:versionId2
```

**Response (200):**
```json
{
  "version1": {
    "id": 1,
    "version_number": 1,
    "model_url": "/uploads/models/colosseum-v1.gltf",
    "changes_description": "Initial 3D scan",
    "created_at": "2023-12-01T00:00:00.000Z"
  },
  "version2": {
    "id": 2,
    "version_number": 2,
    "model_url": "/uploads/models/colosseum-v2.gltf",
    "changes_description": "Updated texture quality",
    "created_at": "2024-01-15T00:00:00.000Z"
  },
  "comparison": {
    "time_difference_days": 45,
    "version_gap": 1
  }
}
```

---

## Environmental Risk Management

### Get All Risks for a Monument
```http
GET /preservation/risks/:monumentId?severity=high
```

**Query Parameters:**
- `severity` (optional) - Filter by severity: low|medium|high|critical

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "monument_id": 1,
      "risk_type": "Climate change",
      "severity": "high",
      "description": "Increased rainfall causing erosion of stone surfaces",
      "recorded_date": "2024-01-10",
      "created_at": "2024-01-10T00:00:00.000Z"
    },
    {
      "id": 2,
      "monument_id": 1,
      "risk_type": "Air pollution",
      "severity": "medium",
      "description": "Urban pollution accelerating deterioration",
      "recorded_date": "2024-02-15",
      "created_at": "2024-02-15T00:00:00.000Z"
    }
  ]
}
```

### Add Environmental Risk
```http
POST /preservation/risks
Authorization: Bearer <admin_or_researcher_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "monument_id": 1,
  "risk_type": "Seismic activity",
  "severity": "critical",
  "description": "Recent earthquake caused structural damage to foundation",
  "recorded_date": "2024-02-20"
}
```

**Response (201):**
```json
{
  "id": 3,
  "monument_id": 1,
  "risk_type": "Seismic activity",
  "severity": "critical",
  "description": "Recent earthquake caused structural damage to foundation",
  "recorded_date": "2024-02-20",
  "created_at": "2024-02-20T00:00:00.000Z"
}
```

### Update Environmental Risk
```http
PUT /preservation/risks/:id
Authorization: Bearer <admin_or_researcher_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "severity": "high",
  "description": "Updated assessment: damage less severe than initially thought"
}
```

### Delete Environmental Risk
```http
DELETE /preservation/risks/:id
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "Risk record deleted successfully"
}
```

### Get Risk Summary
```http
GET /preservation/risks/summary/:monumentId
```

**Response (200):**
```json
{
  "summary": [
    {
      "severity": "critical",
      "count": 1,
      "risk_types": ["Structural damage"]
    },
    {
      "severity": "high",
      "count": 2,
      "risk_types": ["Climate change", "Seismic activity"]
    },
    {
      "severity": "medium",
      "count": 3,
      "risk_types": ["Air pollution", "Tourism impact", "Vegetation growth"]
    },
    {
      "severity": "low",
      "count": 1,
      "risk_types": ["Minor weathering"]
    }
  ]
}
```

---

## Restoration Records

### Get All Restoration Records
```http
GET /preservation/restorations/:monumentId
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "monument_id": 1,
      "restoration_date": "2023-06-01",
      "work_performed": "Structural reinforcement of underground chambers",
      "cost": 500000.00,
      "contractor": "Heritage Restoration Inc",
      "before_images": ["/uploads/restorations/before-1.jpg"],
      "after_images": ["/uploads/restorations/after-1.jpg"],
      "created_at": "2023-06-01T00:00:00.000Z"
    }
  ]
}
```

### Add Restoration Record
```http
POST /preservation/restorations
Authorization: Bearer <admin_or_researcher_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `monument_id` (required) - Monument ID
- `restoration_date` (required) - Date of restoration (YYYY-MM-DD)
- `work_performed` (required) - Description of work
- `cost` (optional) - Cost in USD
- `contractor` (optional) - Contractor name
- `before_images` (files, optional) - Up to 10 before images
- `after_images` (files, optional) - Up to 10 after images

**Response (201):**
```json
{
  "id": 2,
  "monument_id": 1,
  "restoration_date": "2024-02-15",
  "work_performed": "Facade cleaning and stone replacement",
  "cost": 350000.00,
  "contractor": "Ancient Monuments Restoration Ltd",
  "before_images": ["/uploads/restorations/before/img1.jpg"],
  "after_images": ["/uploads/restorations/after/img1.jpg"],
  "created_at": "2024-02-15T00:00:00.000Z"
}
```

### Update Restoration Record
```http
PUT /preservation/restorations/:id
Authorization: Bearer <admin_or_researcher_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "cost": 375000.00,
  "work_performed": "Facade cleaning, stone replacement, and waterproofing"
}
```

### Get Restoration Statistics
```http
GET /preservation/restorations/stats/:monumentId
```

**Response (200):**
```json
{
  "total_restorations": 5,
  "total_cost": 2500000.00,
  "average_cost": 500000.00,
  "first_restoration": "2015-03-15",
  "last_restoration": "2023-06-01"
}
```

---

## Analytics & Dashboard

### Get Monument Analytics
```http
GET /preservation/analytics/:monumentId
```

**Response (200):**
```json
{
  "monument": {
    "id": 1,
    "name": "Colosseum",
    "location": "Rome, Italy",
    "condition_status": "fair"
  },
  "analytics": {
    "total_versions": 3,
    "environmental_risks": {
      "critical": 1,
      "high": 2,
      "medium": 3,
      "low": 1
    },
    "restoration_summary": {
      "total_restorations": 5,
      "total_cost": 2500000.00
    }
  }
}
```

### Get Preservation Dashboard
```http
GET /preservation/dashboard
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "monument_conditions": [
    { "condition_status": "excellent", "count": 5 },
    { "condition_status": "good", "count": 12 },
    { "condition_status": "fair", "count": 18 },
    { "condition_status": "poor", "count": 8 },
    { "condition_status": "critical", "count": 3 }
  ],
  "critical_risks": [
    {
      "name": "Colosseum",
      "location": "Rome, Italy",
      "risk_type": "Structural damage",
      "description": "Cracks in foundation detected",
      "recorded_date": "2024-02-20"
    }
  ],
  "recent_restorations": [
    {
      "name": "Taj Mahal",
      "location": "Agra, India",
      "restoration_date": "2024-01-15",
      "work_performed": "Marble cleaning and restoration",
      "cost": 750000.00
    }
  ]
}
```

---

## Use Cases

### 1. Creating a Digital Twin

**Step 1: Create Monument**
```bash
POST /api/monuments
{
  "name": "Ancient Temple",
  "location": "Athens, Greece",
  "historical_era": "Classical Greece",
  "condition_status": "fair"
}
```

**Step 2: Upload Initial 3D Model**
```bash
POST /api/preservation/versions
{
  "monument_id": 1,
  "version_number": 1,
  "changes_description": "Initial high-resolution 3D scan",
  "model": <3D_MODEL_FILE>
}
```

### 2. Tracking Environmental Threats

```bash
POST /api/preservation/risks
{
  "monument_id": 1,
  "risk_type": "Rising sea levels",
  "severity": "high",
  "description": "Coastal erosion threatening foundation",
  "recorded_date": "2024-02-20"
}
```

### 3. Documenting Restoration Work

```bash
POST /api/preservation/restorations
{
  "monument_id": 1,
  "restoration_date": "2024-03-01",
  "work_performed": "Foundation stabilization and drainage improvement",
  "cost": 450000.00,
  "contractor": "Heritage Conservation Group",
  "before_images": [<IMAGE_FILES>],
  "after_images": [<IMAGE_FILES>]
}
```

### 4. Monitoring Monument Health

```bash
GET /api/preservation/analytics/1
```

Returns comprehensive health metrics including version history, risk assessment, and restoration timeline.

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error: monument_id is required"
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
  "error": "Insufficient permissions. Admin or researcher role required"
}
```

### 404 Not Found
```json
{
  "error": "Monument not found"
}
```

---

## Best Practices

1. **Version Control**: Create a new version whenever significant changes are made to the 3D model
2. **Risk Assessment**: Regularly update environmental risks with current severity levels
3. **Documentation**: Include detailed descriptions for all restoration work
4. **Image Quality**: Upload high-resolution before/after images for restoration records
5. **Cost Tracking**: Maintain accurate cost records for budget planning
6. **Regular Monitoring**: Use the analytics dashboard to track monument health over time

---

## Technical Notes

- All file uploads support GLTF, OBJ, and FBX formats for 3D models
- Maximum file size for 3D models: 100MB
- Maximum file size for images: 10MB
- Supported image formats: JPG, PNG, WebP
- Date format: ISO 8601 (YYYY-MM-DD)
- All timestamps are in UTC

