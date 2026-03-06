# Monument Preservation - 3D Digital Twin System

## Overview

The Monument Preservation system creates detailed 3D digital twins of historical monuments, protecting their legacy against time, climate, and conflict. This comprehensive backend solution provides version control, environmental risk tracking, restoration management, and analytics for cultural heritage preservation.

## Key Features

### 🏛️ 3D Digital Twin Creation
- High-resolution 3D model storage (GLTF, OBJ, FBX formats)
- Multiple monument versions with change tracking
- Comparison tools for analyzing changes over time
- Metadata including location, era, architect, materials, and condition

### 🌍 Environmental Risk Management
- Track climate change impacts (erosion, weathering, temperature)
- Monitor pollution effects (air quality, acid rain)
- Document natural disasters (earthquakes, floods, storms)
- Assess human impacts (tourism, urban development, conflict)
- Severity classification (low, medium, high, critical)
- Risk summary and analytics

### 🔧 Restoration Documentation
- Complete restoration history with dates and costs
- Before/after image galleries
- Contractor and work performed records
- Cost tracking and budget analysis
- Statistical insights (total restorations, average costs, timeline)

### 📊 Analytics Dashboard
- Monument condition overview across all sites
- Critical risk alerts and monitoring
- Recent restoration activity tracking
- Comprehensive monument health metrics
- Version history analysis

## Architecture

```
Monument Preservation System
│
├── Version Control
│   ├── Multiple 3D model versions
│   ├── Change descriptions
│   ├── Version comparison
│   └── Creator tracking
│
├── Environmental Risks
│   ├── Risk type classification
│   ├── Severity levels
│   ├── Date tracking
│   └── Risk summaries
│
├── Restoration Records
│   ├── Work documentation
│   ├── Cost tracking
│   ├── Before/after images
│   └── Contractor information
│
└── Analytics
    ├── Monument health metrics
    ├── Risk assessment
    ├── Restoration statistics
    └── Dashboard insights
```

## Database Schema

### monuments
Core monument information including location, era, condition, and current 3D model.

### monument_versions
Version history of 3D models with change descriptions and timestamps.

### environmental_risks
Environmental threats with severity levels and detailed descriptions.

### restoration_records
Complete restoration history with costs, images, and contractor details.

## API Endpoints

### Monuments
- `GET /api/monuments` - List all monuments with filtering
- `GET /api/monuments/:id` - Get monument with full history

### Version Control
- `GET /api/preservation/versions/:monumentId` - Get all versions
- `POST /api/preservation/versions` - Create new version
- `GET /api/preservation/versions/compare/:id1/:id2` - Compare versions

### Environmental Risks
- `GET /api/preservation/risks/:monumentId` - Get all risks
- `POST /api/preservation/risks` - Add new risk
- `PUT /api/preservation/risks/:id` - Update risk
- `DELETE /api/preservation/risks/:id` - Delete risk
- `GET /api/preservation/risks/summary/:monumentId` - Get risk summary

### Restoration Records
- `GET /api/preservation/restorations/:monumentId` - Get all restorations
- `POST /api/preservation/restorations` - Add restoration record
- `PUT /api/preservation/restorations/:id` - Update restoration
- `GET /api/preservation/restorations/stats/:monumentId` - Get statistics

### Analytics
- `GET /api/preservation/analytics/:monumentId` - Monument analytics
- `GET /api/preservation/dashboard` - Preservation dashboard

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Test Endpoints
```bash
# Get all monuments
curl http://localhost:5000/api/monuments

# Get monument details with full history
curl http://localhost:5000/api/monuments/1

# Get monument analytics
curl http://localhost:5000/api/preservation/analytics/1

# Get preservation dashboard
curl http://localhost:5000/api/preservation/dashboard
```

## Use Cases

### 1. Digital Preservation
Create permanent digital records of monuments threatened by:
- Climate change and natural disasters
- Armed conflict and terrorism
- Urban development and pollution
- Natural deterioration over time

### 2. Restoration Planning
- Document current condition with 3D scans
- Track environmental threats
- Plan restoration work based on risk assessment
- Monitor restoration effectiveness with before/after comparisons

### 3. Research and Education
- Provide detailed 3D models for academic research
- Enable virtual tours and AR experiences
- Document architectural details and construction techniques
- Track changes over time for historical analysis

### 4. Heritage Management
- Monitor multiple monuments from a central dashboard
- Prioritize restoration based on risk severity
- Track restoration budgets and costs
- Generate reports for stakeholders and funding agencies

## Example Workflow

### Creating a Digital Twin

1. **Initial Documentation**
```bash
POST /api/monuments
{
  "name": "Ancient Temple of Athena",
  "location": "Athens, Greece",
  "latitude": 37.9715,
  "longitude": 23.7267,
  "historical_era": "Classical Greece",
  "architect": "Ictinus",
  "materials": "Pentelic marble",
  "condition_status": "fair",
  "description": "5th century BCE temple dedicated to Athena"
}
```

2. **Upload 3D Model**
```bash
POST /api/preservation/versions
{
  "monument_id": 1,
  "version_number": 1,
  "changes_description": "Initial high-resolution photogrammetry scan",
  "model": <3D_MODEL_FILE>
}
```

3. **Document Environmental Risks**
```bash
POST /api/preservation/risks
{
  "monument_id": 1,
  "risk_type": "Air pollution",
  "severity": "high",
  "description": "Urban pollution causing marble deterioration",
  "recorded_date": "2024-02-20"
}
```

4. **Track Restoration Work**
```bash
POST /api/preservation/restorations
{
  "monument_id": 1,
  "restoration_date": "2024-03-01",
  "work_performed": "Marble cleaning and protective coating application",
  "cost": 250000.00,
  "contractor": "Hellenic Heritage Conservation",
  "before_images": [<IMAGES>],
  "after_images": [<IMAGES>]
}
```

5. **Monitor Progress**
```bash
GET /api/preservation/analytics/1
```

## Data Models

### Monument
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
  "description": "Ancient amphitheater",
  "model_url": "/uploads/models/colosseum.gltf",
  "model_format": "GLTF",
  "thumbnail_url": "/uploads/thumbnails/colosseum.jpg"
}
```

### Version
```json
{
  "id": 1,
  "monument_id": 1,
  "version_number": 2,
  "model_url": "/uploads/models/colosseum-v2.gltf",
  "changes_description": "Updated texture quality",
  "created_by_email": "admin@heritage.org",
  "created_at": "2024-01-15T00:00:00.000Z"
}
```

### Environmental Risk
```json
{
  "id": 1,
  "monument_id": 1,
  "risk_type": "Climate change",
  "severity": "high",
  "description": "Increased rainfall causing erosion",
  "recorded_date": "2024-01-10"
}
```

### Restoration Record
```json
{
  "id": 1,
  "monument_id": 1,
  "restoration_date": "2023-06-01",
  "work_performed": "Structural reinforcement",
  "cost": 500000.00,
  "contractor": "Heritage Restoration Inc",
  "before_images": ["/uploads/restorations/before-1.jpg"],
  "after_images": ["/uploads/restorations/after-1.jpg"]
}
```

## Security

- JWT authentication for all write operations
- Role-based access control (admin, researcher, public_user)
- Admin-only access for monument creation/deletion
- Admin and researcher access for risk and restoration management
- Rate limiting to prevent abuse
- File upload validation and size limits

## File Upload Specifications

### 3D Models
- Formats: GLTF, OBJ, FBX
- Max size: 100MB
- Storage: `/uploads/models/`

### Images
- Formats: JPG, PNG, WebP
- Max size: 10MB per image
- Max count: 10 images per restoration record
- Storage: `/uploads/restorations/before/` and `/uploads/restorations/after/`

## Documentation

- [Full API Documentation](./MONUMENT_PRESERVATION_API.md)
- [Testing Guide](./TEST_PRESERVATION_API.md)
- [General API Documentation](./API_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT.md)

## Future Enhancements

- [ ] AI-powered deterioration prediction
- [ ] Automated change detection between versions
- [ ] 3D model diff visualization
- [ ] Integration with weather APIs for real-time risk assessment
- [ ] Mobile app for on-site documentation
- [ ] Blockchain-based provenance tracking
- [ ] Multi-language support for international collaboration
- [ ] Export to standard heritage documentation formats

## Contributing

When adding new features to the Monument Preservation system:
1. Update the database schema if needed
2. Add new endpoints to the routes
3. Update API documentation
4. Add test cases
5. Update this README

## Support

For issues or questions about the Monument Preservation system:
- Check the [API Documentation](./MONUMENT_PRESERVATION_API.md)
- Review the [Testing Guide](./TEST_PRESERVATION_API.md)
- Examine the database schema in `src/database/schema.sql`

## License

Part of the AR Heritage Unfold platform for cultural heritage preservation.

