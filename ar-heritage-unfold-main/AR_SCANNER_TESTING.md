# AR Scanner Testing Guide

## Overview
The AR Scanner feature allows users to preserve new heritage monuments by scanning them with their device camera, placing a 3D model in AR, capturing a thumbnail, and uploading to the backend.

## Implementation Status

### ✅ Completed Features

1. **AR Scanner Utility (`src/utils/arScanner.ts`)**
   - WebXR session initialization with hit-test support
   - Surface detection with visual reticle (green ring)
   - GLB model loading and placement
   - Tap-to-place interaction
   - Thumbnail capture from canvas
   - Session cleanup and disposal

2. **Monument Service (`src/services/monumentService.ts`)**
   - FormData-based API calls
   - File upload support (thumbnail + model)
   - Monument creation endpoint
   - Monument listing with filters

3. **AR Scanner Modal (`src/components/ARScannerModal.tsx`)**
   - Multi-step workflow: form → scanning → placing → capturing → uploading → success
   - Form validation
   - AR support detection
   - Real-time status updates
   - Error handling with toast notifications

4. **Explore Heritage Page (`src/pages/ExploreHeritage.tsx`)**
   - "Add New Heritage" button
   - Modal integration
   - Auto-refresh after successful upload

5. **Backend API (`backend/src/server-simple.js`)**
   - POST /api/monuments endpoint with multer file upload
   - Thumbnail storage to disk (`uploads/thumbnails/`)
   - Model storage to disk (`uploads/models/`)
   - FormData parsing
   - File validation

## Testing Instructions

### Prerequisites
- AR-capable Android device (Android 7.0+ with ARCore support)
- Chrome or Edge browser (WebXR support required)
- HTTPS connection (required for WebXR)

### Step 1: Start Development Servers

```bash
# Terminal 1 - Backend
cd ar-heritage-unfold-main/backend
npm run dev

# Terminal 2 - Frontend
cd ar-heritage-unfold-main
npm run dev
```

### Step 2: Enable HTTPS for Testing

WebXR requires HTTPS. For local testing:

**Option A: Use ngrok (Recommended)**
```bash
# Install ngrok: https://ngrok.com/download
ngrok http 8080
# Use the HTTPS URL provided (e.g., https://abc123.ngrok.io)
```

**Option B: Use Vite HTTPS**
Update `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    https: true,
    host: '0.0.0.0'
  }
})
```

### Step 3: Test AR Scanner Workflow

1. **Open Explore Heritage Page**
   - Navigate to `/explore-heritage`
   - Click "Add New Heritage" button

2. **Fill Monument Form**
   - Name: "Test Monument"
   - Description: "Testing AR scanner feature"
   - Location: "Test Location"
   - Historical Era: "Modern"
   - Click "Start AR Scanning"

3. **AR Session Initialization**
   - Browser will request camera permission → Allow
   - AR mode should start
   - You should see the camera feed

4. **Surface Detection**
   - Point camera at a flat surface (floor, table, ground)
   - Green ring reticle should appear on detected surfaces
   - Move device to find a good placement spot

5. **Model Placement**
   - Tap screen when reticle is visible
   - 3D model (DamagedHelmet) should appear at tap location
   - Model should stay anchored to the surface

6. **Automatic Capture & Upload**
   - After placement, thumbnail is automatically captured
   - AR session ends
   - Upload progress shown
   - Success message displayed

7. **Verify Upload**
   - Modal closes automatically
   - Monument list refreshes
   - New monument appears in grid
   - Check backend console for upload confirmation
   - Check `backend/uploads/thumbnails/` for saved image

### Step 4: Verify Backend Storage

```bash
# Check uploaded files
ls -la backend/uploads/thumbnails/
ls -la backend/uploads/models/

# Check backend logs
# Should see: "✅ Thumbnail saved: /uploads/thumbnails/monument-[timestamp].jpg"
```

## Expected Behavior

### Success Flow
1. Form submission → AR session starts
2. Surface detection → Green reticle visible
3. Tap screen → Model placed
4. Auto-capture → Thumbnail created
5. Upload → Backend saves files
6. Success → Modal closes, list refreshes

### Error Handling
- **No AR Support**: Warning message shown, button disabled
- **Camera Permission Denied**: Error toast, return to form
- **Surface Not Found**: Reticle not visible, keep scanning
- **Upload Failed**: Error toast, return to form
- **Network Error**: Error toast with details

## Troubleshooting

### AR Session Won't Start
- Ensure HTTPS is enabled
- Check browser supports WebXR (Chrome/Edge on Android)
- Verify camera permissions granted
- Check console for errors

### Reticle Not Appearing
- Move device around to scan environment
- Ensure adequate lighting
- Point at flat, textured surfaces
- Avoid reflective or transparent surfaces

### Model Not Placing
- Ensure reticle is visible before tapping
- Tap directly on screen (not buttons)
- Check console for placement errors

### Upload Fails
- Verify backend is running on port 5001
- Check CORS configuration
- Verify multer middleware is working
- Check backend logs for errors
- Ensure `uploads/thumbnails/` directory exists

### Thumbnail Not Saved
- Check `preserveDrawingBuffer: true` in renderer config
- Verify `captureThumbnail()` is called after render
- Check file permissions on uploads directory

## API Endpoints

### POST /api/monuments
**Request**: FormData
- `name` (string, required)
- `description` (string, required)
- `location` (string, optional)
- `historical_era` (string, optional)
- `condition_status` (string, optional)
- `model_url` (string, optional)
- `thumbnail` (file, optional)
- `model` (file, optional)
- `timestamp` (string, optional)

**Response**: 201 Created
```json
{
  "id": 1234567890,
  "name": "Test Monument",
  "description": "Testing AR scanner",
  "location": "Test Location",
  "historical_era": "Modern",
  "condition_status": "good",
  "model_url": "https://...",
  "model_format": "GLTF",
  "thumbnail_url": "/uploads/thumbnails/monument-1234567890.jpg",
  "created_at": "2024-03-01T12:00:00.000Z"
}
```

## Known Limitations

1. **Device Support**: Only works on AR-capable Android devices with ARCore
2. **Browser Support**: Chrome and Edge only (no Safari/Firefox WebXR support yet)
3. **HTTPS Required**: Must use HTTPS for WebXR API access
4. **Model Selection**: Currently uses hardcoded sample model (DamagedHelmet.glb)
5. **Storage**: Files saved to local disk (not cloud storage yet)
6. **Database**: Monuments not persisted to database (in-memory only)

## Future Enhancements

1. **Cloud Storage**: Upload thumbnails to S3/Cloudinary
2. **Database Persistence**: Save monuments to SQLite/PostgreSQL
3. **Model Selection**: Allow users to choose or upload custom models
4. **Real-time Preview**: Show camera feed before AR session
5. **Multiple Photos**: Capture multiple angles
6. **AR Measurements**: Add size/scale measurements
7. **Location Tracking**: Auto-detect GPS coordinates
8. **Offline Support**: Cache models for offline use

## Code Structure

```
src/
├── utils/
│   └── arScanner.ts          # AR scanner utility class
├── services/
│   └── monumentService.ts    # API service for monuments
├── components/
│   └── ARScannerModal.tsx    # Modal component
└── pages/
    └── ExploreHeritage.tsx   # Main page with button

backend/
├── src/
│   ├── server-simple.js      # Express server with POST endpoint
│   └── middleware/
│       └── upload.js         # Multer file upload middleware
└── uploads/
    ├── thumbnails/           # Saved thumbnail images
    └── models/               # Saved 3D models
```

## Testing Checklist

- [ ] Backend server running on port 5001
- [ ] Frontend server running with HTTPS
- [ ] AR-capable device with Chrome/Edge
- [ ] Camera permissions granted
- [ ] "Add New Heritage" button visible
- [ ] Form validation works
- [ ] AR session starts successfully
- [ ] Surface detection shows reticle
- [ ] Tap-to-place works
- [ ] Model appears at correct location
- [ ] Thumbnail captured successfully
- [ ] Upload completes without errors
- [ ] Success message displayed
- [ ] Monument appears in list
- [ ] Thumbnail file saved to disk
- [ ] Backend logs show success

## Support

For issues or questions:
1. Check browser console for errors
2. Check backend logs for upload issues
3. Verify WebXR support: https://immersiveweb.dev/
4. Test device compatibility: https://developers.google.com/ar/devices
