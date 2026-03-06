# Quick Start Guide - AR Heritage Platform

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation & Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Start the Backend Server

```bash
cd backend
npm run dev
```

Backend will start on: **http://localhost:5001**

You should see:
```
✅ Server running on http://localhost:5001
✅ WebSocket server running on ws://localhost:5001
```

### 3. Start the Frontend (in a new terminal)

```bash
npm run dev
```

Frontend will start on: **http://localhost:8080**

You should see:
```
VITE v5.4.19  ready in XXX ms
➜  Local:   http://localhost:8080/
```

## Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

## Available Pages

### 1. Home Page
**URL:** http://localhost:8080/

Landing page with hero section and call-to-action.

### 2. Explore Heritage
**URL:** http://localhost:8080/explore

Browse all monuments with:
- Search functionality
- Filter by era
- Filter by condition
- Grid view of monuments

### 3. AR Viewer
**URL:** http://localhost:8080/ar-viewer/1

Interactive 3D viewer for monuments:
- Rotate, zoom, and pan 3D models
- View monument information
- Control buttons for easy navigation

### 4. Monument Details
**URL:** http://localhost:8080/monument/1

Detailed information including:
- Monument description
- Version history
- Environmental risks
- Restoration records

### 5. Admin Upload
**URL:** http://localhost:8080/admin/upload

Upload new monuments with:
- Monument information form
- 3D model upload
- Thumbnail image upload

## Testing the API

### Using Browser
Open these URLs in your browser:

```
http://localhost:5001/api/monuments
http://localhost:5001/api/monuments/1
http://localhost:5001/api/preservation/analytics/1
http://localhost:5001/api/preservation/dashboard
```

### Using cURL

```bash
# Get all monuments
curl http://localhost:5001/api/monuments

# Get monument details
curl http://localhost:5001/api/monuments/1

# Get monument versions
curl http://localhost:5001/api/preservation/versions/1

# Get environmental risks
curl http://localhost:5001/api/preservation/risks/1

# Get restoration records
curl http://localhost:5001/api/preservation/restorations/1

# Get analytics
curl http://localhost:5001/api/preservation/analytics/1

# Get dashboard
curl http://localhost:5001/api/preservation/dashboard
```

## Sample Data

The backend includes sample data for:
- 2 monuments (Colosseum, Taj Mahal)
- Version history
- Environmental risks
- Restoration records

## Common Issues

### Port Already in Use

If port 8080 or 5001 is already in use:

**Frontend:**
```bash
# Vite will automatically try the next available port
# Check the terminal output for the actual port
```

**Backend:**
Edit `backend/src/server-simple.js`:
```javascript
const PORT = process.env.PORT || 5002; // Change to different port
```

### Module Not Found

```bash
# Reinstall dependencies
npm install
cd backend && npm install
```

### Three.js Import Errors

```bash
# Ensure Three.js is installed
npm install three @types/three
```

## Development Workflow

### 1. Explore Monuments
1. Go to http://localhost:8080/explore
2. Browse available monuments
3. Use search and filters
4. Click "View in AR" on any monument

### 2. View in 3D
1. Interactive 3D viewer loads
2. Use mouse to rotate (click + drag)
3. Scroll to zoom
4. Use control buttons for quick actions
5. Toggle info panel with info button

### 3. View Details
1. Click "Details" on monument card
2. View comprehensive information
3. Check version history
4. Review environmental risks
5. See restoration records

### 4. Upload Monument (Admin)
1. Go to http://localhost:8080/admin/upload
2. Fill in monument information
3. Upload 3D model file
4. Upload thumbnail image
5. Submit form

## File Structure

```
ar-heritage-unfold-main/
├── src/
│   ├── pages/
│   │   ├── Index.tsx              # Home page
│   │   ├── ExploreHeritage.tsx    # Browse monuments
│   │   ├── ARViewer.tsx           # 3D viewer with Three.js
│   │   ├── MonumentDetails.tsx    # Detailed monument info
│   │   └── AdminUpload.tsx        # Upload form
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation
│   │   ├── Footer.tsx             # Footer
│   │   └── ui/                    # UI components
│   └── App.tsx                    # Main app with routing
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── monument-preservation.js  # Preservation API
│   │   └── server-simple.js       # Express server
│   └── data/
│       └── db.json                # JSON database
└── package.json
```

## Next Steps

1. **Customize the UI**: Edit components in `src/components/`
2. **Add More Monuments**: Use the admin upload page
3. **Enhance 3D Viewer**: Modify `src/pages/ARViewer.tsx`
4. **Add Authentication**: Implement user login/registration
5. **Deploy**: Follow deployment guides for production

## Documentation

- [Frontend Features](./FRONTEND_FEATURES.md)
- [Backend API](./backend/MONUMENT_PRESERVATION_API.md)
- [Testing Guide](./backend/TEST_PRESERVATION_API.md)
- [Backend README](./backend/MONUMENT_PRESERVATION_README.md)

## Support

For issues or questions:
1. Check the documentation files
2. Review the API endpoints
3. Inspect browser console for errors
4. Check backend terminal for server logs

## Production Build

### Frontend
```bash
npm run build
```
Output in `dist/` folder

### Backend
```bash
cd backend
npm start
```

## Environment Variables

Create `.env` files for configuration:

**Backend (.env):**
```
PORT=5001
NODE_ENV=development
JWT_SECRET=your-secret-key
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5001
```

## Happy Exploring! 🏛️

Your AR Heritage platform is now ready to preserve and showcase historical monuments through immersive 3D experiences!

