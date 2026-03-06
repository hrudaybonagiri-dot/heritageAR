# Navigation Map - AR Heritage Platform

## 🗺️ Site Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        HOME PAGE (/)                         │
│  • Hero section with AR Heritage introduction               │
│  • "Explore Heritage" button → /explore                     │
│  • "Learn More" button → /about                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  EXPLORE HERITAGE (/explore)                 │
│  • Browse all monuments in grid layout                      │
│  • Search by name or location                               │
│  • Filter by historical era                                 │
│  • Filter by condition status                               │
│  • Monument cards with:                                     │
│    - Thumbnail image                                        │
│    - Name and location                                      │
│    - Historical era                                         │
│    - Condition badge                                        │
│    - "View in AR" button → /ar-viewer/:id                  │
│    - "Details" button → /monument/:id                      │
└─────────────────────────────────────────────────────────────┘
                    │                    │
                    ↓                    ↓
    ┌───────────────────────┐  ┌───────────────────────┐
    │  AR VIEWER            │  │  MONUMENT DETAILS     │
    │  (/ar-viewer/:id)     │  │  (/monument/:id)      │
    │                       │  │                       │
    │  • 3D model viewer    │  │  • Full description   │
    │  • Three.js rendering │  │  • Historical info    │
    │  • Interactive        │  │  • Tabs:              │
    │    controls           │  │    - Versions         │
    │  • Rotate, zoom, pan  │  │    - Risks            │
    │  • Info panel         │  │    - Restorations     │
    │  • Monument metadata  │  │  • Quick stats        │
    │                       │  │  • "View in AR" btn   │
    └───────────────────────┘  └───────────────────────┘
                    │                    │
                    └────────┬───────────┘
                             ↓
                    ┌───────────────────────┐
                    │  Can navigate between │
                    │  AR Viewer ↔ Details  │
                    └───────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                ADMIN UPLOAD (/admin/upload)                  │
│  • Upload new monuments                                     │
│  • Form fields:                                             │
│    - Basic info (name, location, coordinates)              │
│    - Historical details (era, architect, materials)        │
│    - Condition status                                      │
│    - Description                                           │
│  • File uploads:                                           │
│    - 3D model (GLTF, OBJ, FBX)                            │
│    - Thumbnail image                                       │
│  • Submit → redirects to /explore                          │
└─────────────────────────────────────────────────────────────┘
```

## 📍 Navigation Bar (All Pages)

```
┌────────────────────────────────────────────────────────────┐
│  HeritageAR  │  Home  │  Explore Heritage  │  About  │     │
│              │  Features  │  How It Works  │  Gallery │    │
│              │  Contact  │                    [Get Started] │
└────────────────────────────────────────────────────────────┘
```

## 🔗 URL Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with hero section |
| `/explore` | Explore Heritage | Browse all monuments |
| `/ar-viewer/:id` | AR Viewer | 3D visualization with Three.js |
| `/monument/:id` | Monument Details | Comprehensive information |
| `/admin/upload` | Admin Upload | Upload new monuments |
| `/about` | About | About the platform |
| `/features` | Features | Platform features |
| `/how-it-works` | How It Works | Usage guide |
| `/gallery` | Gallery | Image gallery |
| `/contact` | Contact | Contact form |

## 🎯 User Journeys

### Journey 1: Explore and View Monument
```
Home → Explore Heritage → Monument Card → AR Viewer
                                       ↓
                              Interact with 3D Model
                                       ↓
                              View Monument Details
```

### Journey 2: Research Monument History
```
Home → Explore Heritage → Monument Card → Details
                                            ↓
                                    View Versions Tab
                                            ↓
                                    View Risks Tab
                                            ↓
                                    View Restorations Tab
                                            ↓
                                    Click "View in AR"
                                            ↓
                                    AR Viewer
```

### Journey 3: Upload New Monument (Admin)
```
Admin Upload → Fill Form → Upload Files → Submit
                                            ↓
                                    Explore Heritage
                                            ↓
                                    View New Monument
```

## 🎨 Page Features

### Home Page
- **Hero Section**: Large banner with call-to-action
- **Primary CTA**: "Explore Heritage" → /explore
- **Secondary CTA**: "Learn More" → /about
- **Scroll Indicator**: Animated scroll prompt

### Explore Heritage
- **Search Bar**: Real-time search
- **Era Filter**: Dropdown with historical periods
- **Condition Filter**: Dropdown with status levels
- **Monument Grid**: Responsive card layout
- **Card Actions**: 
  - "View in AR" → AR Viewer
  - "Details" → Monument Details

### AR Viewer
- **3D Canvas**: Full-screen Three.js renderer
- **Control Buttons**: 
  - Zoom In/Out
  - Rotate 90°
  - Reset View
- **Info Panel**: Collapsible sidebar with:
  - Monument name and location
  - Condition badge
  - Historical era
  - Architect
  - Materials
  - Description
  - "View Full Details" button
- **Header**: Back button and monument title

### Monument Details
- **Header Section**:
  - Monument name
  - Location with icon
  - Condition badge
  - "View in AR" button
- **Main Content**:
  - About section with description
  - Tabbed interface:
    - Versions: Version history
    - Risks: Environmental threats
    - Restorations: Restoration records
- **Sidebar**:
  - Details card (era, architect, materials, coordinates)
  - Quick stats (versions, risks, restorations count)

### Admin Upload
- **Form Sections**:
  - Basic Information
  - Historical Details
  - 3D Model & Images
- **File Upload Areas**:
  - Drag-and-drop for 3D models
  - Drag-and-drop for thumbnails
- **Actions**:
  - "Upload Monument" button
  - "Cancel" button → /explore
- **Guidelines Card**: Upload tips and requirements

## 🔄 Navigation Patterns

### Primary Navigation
```
Navbar → Any Page
```

### Secondary Navigation
```
Explore Heritage → AR Viewer → Monument Details
                ↓                      ↑
                └──────────────────────┘
```

### Breadcrumb Pattern
```
AR Viewer: [Back Button] → Explore Heritage
Monument Details: [Back Button] → Explore Heritage
Admin Upload: [Back Button] → Explore Heritage
```

## 📱 Mobile Navigation

On mobile devices:
- Hamburger menu for navigation
- Collapsible menu with all links
- Touch-friendly buttons
- Responsive 3D controls
- Swipe gestures in AR Viewer

## 🎮 Interactive Elements

### AR Viewer Controls
- **Mouse**: Click + drag to rotate
- **Scroll**: Zoom in/out
- **Right-click**: Pan camera
- **Buttons**: Quick actions

### Monument Cards
- **Hover**: Shadow elevation
- **Click**: Navigate to details or AR viewer

### Filters
- **Search**: Real-time filtering
- **Dropdowns**: Instant filter application

## 🚀 Quick Access

### From Any Page
- **Navbar**: Access all main sections
- **Logo**: Return to home
- **Get Started**: Go to contact

### From Explore Heritage
- **Search**: Find specific monuments
- **Filters**: Narrow down results
- **Cards**: Direct access to AR or details

### From AR Viewer
- **Back Button**: Return to explore
- **Info Button**: Toggle info panel
- **View Details**: Go to full details page

### From Monument Details
- **Back Button**: Return to explore
- **View in AR**: Open AR viewer
- **Tabs**: Switch between data views

## 📊 Data Flow

```
Backend API (localhost:5001)
        ↓
    Fetch Data
        ↓
Frontend Pages (localhost:8080)
        ↓
    Display Content
        ↓
    User Interaction
        ↓
    Update View
```

## 🎯 Key Features by Page

| Page | Key Features |
|------|-------------|
| Home | Hero, CTA buttons, Animations |
| Explore | Search, Filters, Grid, Cards |
| AR Viewer | 3D rendering, Controls, Info panel |
| Details | Tabs, History, Stats, Links |
| Upload | Form, File uploads, Validation |

## 🌟 User Experience Highlights

1. **Intuitive Navigation**: Clear paths between pages
2. **Consistent Layout**: Navbar and footer on all pages
3. **Quick Actions**: Direct access to AR viewer
4. **Rich Information**: Comprehensive monument data
5. **Interactive 3D**: Engaging visualization
6. **Responsive Design**: Works on all devices
7. **Fast Loading**: Optimized performance
8. **Error Handling**: Graceful fallbacks

