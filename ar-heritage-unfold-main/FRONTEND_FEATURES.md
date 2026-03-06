# Frontend Features - AR Heritage Platform

## Overview

The AR Heritage platform now includes a complete multi-page application with Three.js + WebXR integration for viewing 3D digital twins of historical monuments in both standard 3D view and true augmented reality mode.

## New Pages

### 1. Home Page (`/`)
- Hero section with call-to-action
- Links to explore heritage monuments
- Beautiful gradient animations

### 2. Explore Heritage (`/explore`)
**Features:**
- Browse all monuments from the backend API
- Search by name or location
- Filter by historical era (Ancient Rome, Ancient Egypt, etc.)
- Filter by condition status (excellent, good, fair, poor, critical)
- Grid view with monument cards
- Quick access to AR viewer and details

**API Integration:**
- Fetches monuments from `http://localhost:5001/api/monuments`
- Real-time filtering and search
- Responsive design

### 3. AR Viewer (`/ar-viewer/:id`) ⭐ ENHANCED
**Features:**
- Full-screen 3D viewer using Three.js
- **WebXR AR Mode** - View monuments in your real environment
- GLB model loading with progress tracking
- Interactive 3D model viewing
- Mouse controls:
  - Rotate: Click and drag
  - Zoom: Scroll wheel
  - Pan: Right-click and drag
- Control buttons:
  - Zoom In/Out
  - Rotate 90°
  - Reset view
- AR-specific features:
  - Automatic AR capability detection
  - "Start AR" button for compatible devices
  - AR status indicators
  - Mode-aware UI (controls hidden in AR)
- Side panel with monument information
- Placeholder 3D model (temple with columns) when no model is available

**Technologies:**
- Three.js for 3D rendering
- **WebXR API for AR mode**
- **ARButton for AR session management**
- OrbitControls for camera manipulation
- GLTFLoader for loading .glb models
- WebGL renderer with shadows and lighting

**AR Mode:**
- Works on Android (ARCore) and iOS 15.4+ (ARKit)
- Chrome 79+, Safari 15.4+
- Camera-based AR placement
- Real-world surface detection
- Immersive viewing experience

**API Integration:**
- Fetches monument details from `http://localhost:5001/api/monuments/:id`
- Loads GLB models from monument.model_url
- Supports both local and remote model URLs

### 4. Monument Details (`/monument/:id`)
**Features:**
- Comprehensive monument information
- Tabbed interface:
  - **Versions**: View all 3D model versions with change history
  - **Risks**: Environmental risks with severity levels
  - **Restorations**: Restoration records with costs and contractors
- Quick stats sidebar
- Detailed information cards
- Link to AR viewer

**API Integration:**
- Fetches full monument data including versions, risks, and restorations
- Displays all related preservation data

### 5. Admin Upload Page (`/admin/upload`)
**Features:**
- Form to upload new monuments
- Fields:
  - Basic info (name, location, coordinates)
  - Historical details (era, architect, materials)
  - Condition status
  - Description
  - 3D model file upload (GLTF, OBJ, FBX)
  - Thumbnail image upload
- File upload with drag-and-drop UI
- Form validation
- Upload guidelines

**Note:** Currently uses mock upload (replace with actual API endpoint)

## Navigation

Updated navigation bar includes:
- Home
- Explore Heritage (new)
- About
- Features
- How It Works
- Gallery
- Contact

## Technologies Used

### Frontend Framework
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation

### 3D Graphics
- **Three.js** - 3D rendering engine
- **OrbitControls** - Camera controls
- **GLTFLoader** - 3D model loading
- WebGL renderer with:
  - Ambient lighting
  - Directional lighting with shadows
  - Hemisphere lighting
  - Grid helper for reference

### UI Components
- Shadcn/ui component library
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons

### State Management
- React hooks (useState, useEffect, useRef)
- TanStack Query for API calls

## API Endpoints Used

### Monuments
- `GET /api/monuments` - List all monuments with filters
- `GET /api/monuments/:id` - Get monument details with full history

### Preservation (used in details page)
- Monument versions
- Environmental risks
- Restoration records

## Running the Application

### Start Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5001

### Start Frontend
```bash
npm run dev
```
Frontend runs on: http://localhost:8080

## Usage Flow

1. **Home** → Click "Explore Heritage"
2. **Explore Heritage** → Browse monuments, use filters
3. **Monument Card** → Click "View in AR" or "Details"
4. **AR Viewer** → Interact with 3D model, rotate, zoom
5. **Monument Details** → View versions, risks, restorations
6. **Admin Upload** → Upload new monuments (admin only)

## 3D Model Support

### Supported Formats
- **GLB (.glb)** - Recommended (binary GLTF)
- GLTF (.gltf) - JSON format
- OBJ (.obj) - Legacy support
- FBX (.fbx) - Legacy support

### GLB Model Advantages
- Single file (geometry + textures)
- Smaller file size
- Faster loading
- Better compression
- WebXR AR compatible
- Industry standard

### Model Requirements
- Optimized for web (recommended: under 10MB)
- Proper UV mapping for textures
- Centered at origin
- Appropriate scale
- Under 100K triangles for mobile AR

### Sample Models
The platform includes sample GLB models from Khronos:
- Damaged Helmet (~3MB) - High detail example
- Lantern (~1MB) - Optimized example
- More available at: https://github.com/KhronosGroup/glTF-Sample-Models

### Model Loading
- Progress tracking during load
- Automatic scaling and centering
- Shadow casting enabled
- Error handling with fallback
- Toast notifications for status

### Placeholder Model
When no 3D model is available, a procedural temple is generated:
- Stone base platform
- Four marble columns
- Wooden roof
- Realistic materials and shadows

## Features Highlights

### WebXR Augmented Reality
- True AR mode on compatible devices
- Android (ARCore) and iOS 15.4+ (ARKit) support
- Camera-based placement in real environment
- Surface detection and hit-testing
- Immersive viewing experience
- Automatic capability detection
- Graceful fallback for non-AR devices

### Interactive 3D Viewing
- Real-time rendering at 60 FPS
- Smooth camera controls
- Dynamic lighting and shadows
- Responsive to window resize
- Mode-aware UI (adapts to AR/3D mode)
- Loading indicators and progress tracking

### GLB Model Loading
- Optimized binary GLTF format
- Progress tracking during load
- Automatic model optimization
- Error handling with fallback
- Toast notifications
- Support for remote and local models

### Data Visualization
- Color-coded condition badges
- Severity indicators for risks
- Timeline of restorations
- Version history tracking

### Responsive Design
- Mobile-friendly layouts
- Touch controls for 3D viewer
- Adaptive grid layouts
- Collapsible side panels

## Future Enhancements

- [ ] Advanced WebXR features (occlusion, lighting estimation)
- [ ] Multi-marker AR tracking
- [ ] Image target recognition
- [ ] Persistent AR anchors
- [ ] Shared AR experiences
- [ ] AR annotations and measurements
- [ ] Screenshot/video capture in AR
- [ ] Social sharing from AR mode
- [ ] Hand tracking and gestures
- [ ] Face tracking for interactive experiences
- [ ] VR mode support
- [ ] Multi-user collaboration
- [ ] Real-time annotations on 3D models
- [ ] 360° photo integration
- [ ] Audio guides integration
- [ ] Bookmark/favorites system

## Development Notes

### Adding New 3D Models
1. Upload model file to backend storage
2. Create monument record with model_url
3. Model will automatically load in AR viewer
4. Supports GLTF, OBJ, and FBX formats

### Customizing 3D Viewer
Edit `src/pages/ARViewer.tsx`:
- Adjust camera position in `initThreeJS()`
- Modify lighting in scene setup
- Change placeholder model in `createPlaceholderModel()`
- Add custom controls or features

### Styling
- Uses Tailwind CSS utility classes
- Custom gradients defined in CSS
- Shadcn/ui theme customization in `components.json`

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 15+)
- WebXR: Requires compatible device and browser

## Performance

- Optimized 3D rendering
- Lazy loading of models
- Efficient API calls
- Responsive image loading
- Code splitting with React Router



## Browser Compatibility

### Desktop
- Chrome/Edge: ✅ Full 3D support, ⚠️ Limited AR
- Firefox: ✅ Full 3D support, ❌ No AR yet
- Safari: ✅ Full 3D support, ⚠️ Limited AR

### Mobile
- Chrome (Android 8.0+): ✅ Full support with AR
- Safari (iOS 15.4+): ✅ Full support with AR
- Edge (Android): ✅ Full support with AR
- Firefox Mobile: ✅ 3D only, ❌ No AR yet

### AR Requirements
- Android: ARCore support, Chrome 79+
- iOS: iOS 15.4+, Safari 15.4+
- HTTPS required (localhost allowed for development)
- Camera and motion sensor permissions

## Additional Documentation

- [WebXR AR Mode Guide](./WEBXR_AR_GUIDE.md) - Complete AR implementation guide
- [Quick Start Guide](./QUICK_START.md) - Getting started
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Overview of all features
- [Navigation Map](./NAVIGATION_MAP.md) - Site structure and user flows
