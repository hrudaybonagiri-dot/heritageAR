# Database ER Diagram

## Entity Relationship Overview

```
┌─────────────────┐
│     USERS       │
│─────────────────│
│ PK id           │
│    email        │
│    password_hash│
│    role         │
└────────┬────────┘
         │
         │ created_by
         ├──────────────────────────────────┐
         │                                  │
         │                                  │
┌────────▼────────┐              ┌─────────▼────────┐
│   MONUMENTS     │              │    ARTIFACTS     │
│─────────────────│              │──────────────────│
│ PK id           │              │ PK id            │
│    name         │              │    name          │
│    location     │              │    origin        │
│    latitude     │              │    age_years     │
│    longitude    │              │    era           │
│    historical_era│             │    material      │
│    architect    │              │    discovery_site│
│    materials    │              │ FK museum_id     │
│    condition    │              │ FK created_by    │
│    model_url    │              └─────────┬────────┘
│    model_format │                        │
│ FK created_by   │                        │
└────────┬────────┘                        │
         │                                 │
         │                                 │
    ┌────┴────┐                       ┌────┴────┐
    │         │                       │         │
┌───▼──────┐ ┌▼──────────┐  ┌────────▼──┐ ┌───▼──────────┐
│MONUMENT  │ │ENVIRON-   │  │ARTIFACT   │ │RECOGNITION   │
│VERSIONS  │ │MENTAL     │  │IMAGES     │ │RESULTS       │
│──────────│ │RISKS      │  │───────────│ │──────────────│
│PK id     │ │───────────│  │PK id      │ │PK id         │
│FK mon_id │ │PK id      │  │FK art_id  │ │FK artifact_id│
│  version │ │FK mon_id  │  │  image_url│ │  image_url   │
│  model   │ │  risk_type│  │  type     │ │  ai_model    │
└──────────┘ │  severity │  └───────────┘ │  confidence  │
             └───────────┘                 │  tags        │
                                          │  ocr_text    │
             ┌───────────┐                └──────────────┘
             │RESTORATION│
             │RECORDS    │                ┌──────────────┐
             │───────────│                │  MUSEUMS     │
             │PK id      │                │──────────────│
             │FK mon_id  │                │PK id         │
             │  date     │◄───────────────┤  name        │
             │  work     │                │  location    │
             │  cost     │                │  website     │
             └───────────┘                └──────────────┘


┌─────────────────┐
│ CIVILIZATIONS   │
│─────────────────│
│ PK id           │
│    name         │
│    region       │
│    start_year   │
│    end_year     │
└────────┬────────┘
         │
         │
    ┌────┴────┐
    │         │
┌───▼──────┐ ┌▼──────────────┐
│AR_SCENES │ │HISTORICAL     │
│──────────│ │EVENTS         │
│PK id     │ │───────────────│
│FK civ_id │ │PK id          │
│  name    │ │FK civ_id      │
│  config  │ │FK ar_scene_id │
│  anchors │ │  title        │
│  duration│ │  description  │
│  level   │ │  event_year   │
└────┬─────┘ └───────────────┘
     │
     │
┌────┴──────────┐
│               │
│  ┌────────────▼──┐  ┌──────────────┐
│  │AUDIO_GUIDES   │  │USER_         │
│  │───────────────│  │INTERACTIONS  │
│  │PK id          │  │──────────────│
│  │FK ar_scene_id │  │PK id         │
│  │  language     │  │FK user_id    │
│  │  audio_url    │  │FK ar_scene_id│
│  │  transcript   │  │  type        │
│  └───────────────┘  │  position_x  │
│                     │  position_y  │
│                     │  position_z  │
│                     │  engagement  │
│                     └──────────────┘


┌─────────────────┐
│   CATEGORIES    │
│─────────────────│
│ PK id           │
│    name         │
│ FK parent_id    │◄─── Self-referencing (hierarchical)
└────────┬────────┘
         │
         │
         │ Many-to-Many
         │
┌────────▼────────────────┐
│ ARTIFACT_CATEGORIES     │
│─────────────────────────│
│ PK,FK artifact_id       │
│ PK,FK category_id       │
└─────────────────────────┘
```

## Relationships

### Users
- One user creates many monuments (1:N)
- One user creates many artifacts (1:N)
- One user has many interactions (1:N)

### Monuments
- One monument has many versions (1:N)
- One monument has many environmental risks (1:N)
- One monument has many restoration records (1:N)

### Artifacts
- One artifact belongs to one museum (N:1)
- One artifact has many images (1:N)
- One artifact has many recognition results (1:N)
- One artifact belongs to many categories (N:M via artifact_categories)

### Civilizations
- One civilization has many AR scenes (1:N)
- One civilization has many historical events (1:N)

### AR Scenes
- One AR scene has many audio guides (1:N)
- One AR scene has many user interactions (1:N)
- One AR scene has many historical events (1:N)

### Categories
- Self-referencing for hierarchical structure (parent-child)
- Many-to-many with artifacts

## Key Features

### Cascade Deletes
- Deleting a monument removes all versions, risks, and restoration records
- Deleting an artifact removes all images and recognition results
- Deleting a civilization removes all AR scenes and events
- Deleting an AR scene removes audio guides and interactions

### Indexes
- `monuments`: location, historical_era
- `artifacts`: origin, era
- `user_interactions`: ar_scene_id, user_id
- `historical_events`: civilization_id

### Constraints
- `condition_status`: CHECK (excellent|good|fair|poor|critical)
- `model_format`: CHECK (GLTF|OBJ|FBX)
- `role`: CHECK (admin|researcher|public_user)
- `severity`: CHECK (low|medium|high|critical)
- `difficulty_level`: CHECK (beginner|intermediate|advanced)
- `image_type`: CHECK (primary|detail|scan|xray)

## Data Types

### Spatial Data
- `latitude`: DECIMAL(10, 8) - Precise GPS coordinates
- `longitude`: DECIMAL(11, 8) - Precise GPS coordinates
- `position_x/y/z`: DECIMAL(10, 6) - AR spatial coordinates

### JSON Data
- `scene_config`: JSONB - AR scene configuration
- `anchor_data`: JSONB - Spatial anchors
- `interaction_data`: JSONB - Custom interaction metadata
- `metadata`: JSONB - AI recognition metadata

### Arrays
- `recognized_tags`: TEXT[] - AI-generated tags
- `before_images`: TEXT[] - Restoration images
- `after_images`: TEXT[] - Restoration images
- `media_urls`: TEXT[] - Event media

### Timestamps
- All tables have `created_at` (default: CURRENT_TIMESTAMP)
- Main entities have `updated_at` (updated on modification)
