# AR Scanner Feature - Quick Start

## 🎯 What This Feature Does

The AR Scanner allows users to preserve heritage monuments by:
1. Opening their device camera in AR mode
2. Detecting flat surfaces (floors, tables, ground)
3. Placing a 3D model on the detected surface
4. Capturing a thumbnail photo
5. Uploading the monument data to the backend

## 🚀 Quick Start

### 1. Start the Servers

```bash
# Terminal 1 - Backend (port 5001)
cd ar-heritage-unfold-main/backend
npm run dev

# Terminal 2 - Frontend (port 8080)
cd ar-heritage-unfold-main
npm run dev
```

### 2. Open the App

Navigate to: `http://localhost:8080/explore-heritage`

### 3. Test the Feature

1. Click the **"Add New Heritage"** button (top right)
2. Fill in the monument details:
   - Name: "Test Monument"
   - Description: "Testing AR scanner"
   - Location: "Test Location" (optional)
   - Historical Era: "Modern" (optional)
3. Click **"Start AR Scanning"**

⚠️ **Important**: For full AR testing, you need:
- An AR-capable Android device (with ARCore)
- Chrome or Edge browser
- HTTPS connection (see below)

## 🔒 HTTPS Setup (Required for AR)

WebXR requires HTTPS. Choose one option:

### Option A: ngrok (Easiest)
```bash
# Install ngrok from https://ngrok.com/download
ngrok http 8080

# Use the HTTPS URL provided (e.g., https://abc123.ngrok.io)
# Open this URL on your Android device
```

### Option B: Local Network with Self-Signed Certificate
```bash
# Update vite.config.ts
server: {
  https: true,
  host: '0.0.0.0'
}

# Access via https://[your-ip]:8080
# Accept the security warning
```

## 📱 Testing on Device

1. **Open HTTPS URL** on your Android device
2. **Grant camera permission** when prompted
3. **Point camera at a flat surface** (floor, table)
4. **Look for the green ring** (reticle) on the surface
5. **Tap the screen** to place the 3D model
6. **Wait for automatic upload** (2-3 seconds)
7. **See success message** and new monument in the list

## ✅ What's Working

- ✅ AR session initialization
- ✅ Surface detection with visual reticle
- ✅ 3D model loading (.glb format)
- ✅ Tap-to-place interaction
- ✅ Thumbnail capture from AR view
- ✅ File upload to backend
- ✅ Monument display in grid
- ✅ Auto-refresh after upload

## 📁 File Structure

```
src/
├── utils/arScanner.ts           # AR scanner class
├── services/monumentService.ts  # API service
├── components/ARScannerModal.tsx # Modal UI
└── pages/ExploreHeritage.tsx    # Main page

backend/
├── src/server-simple.js         # API endpoint
└── uploads/
    ├── thumbnails/              # Saved images
    └── models/                  # Saved 3D models
```

## 🔍 Verify Upload

After successful upload, check:

```bash
# View uploaded thumbnails
ls -la ar-heritage-unfold-main/backend/uploads/thumbnails/

# Check backend logs
# Should see: "✅ Thumbnail saved: /uploads/thumbnails/monument-[timestamp].jpg"
```

## 🐛 Troubleshooting

### "AR Not Supported" Message
- Use an Android device with ARCore
- Use Chrome or Edge browser
- Ensure HTTPS is enabled

### Camera Won't Open
- Grant camera permissions
- Check HTTPS is enabled
- Try reloading the page

### Green Ring Not Appearing
- Move device around to scan environment
- Point at flat, textured surfaces
- Ensure good lighting
- Avoid reflective surfaces

### Upload Fails
- Check backend is running on port 5001
- Check browser console for errors
- Verify CORS is configured
- Check backend logs

### Model Doesn't Place
- Ensure green ring is visible
- Tap directly on the screen
- Wait for reticle to stabilize

## 📚 Documentation

- **AR_SCANNER_TESTING.md** - Comprehensive testing guide
- **AR_SCANNER_IMPLEMENTATION.md** - Technical implementation details
- **AR_SURFACE_DETECTION_GUIDE.md** - WebXR surface detection guide
- **AR_TESTING_GUIDE.md** - General AR testing guide

## 🎨 UI Flow

```
[Add New Heritage Button]
         ↓
[Monument Details Form]
         ↓
[Start AR Scanning]
         ↓
[Camera Opens - AR Mode]
         ↓
[Green Ring on Surface]
         ↓
[Tap to Place Model]
         ↓
[Auto Capture & Upload]
         ↓
[Success Message]
         ↓
[Monument Appears in Grid]
```

## 🔧 API Endpoint

```
POST /api/monuments
Content-Type: multipart/form-data

Body:
- name: string (required)
- description: string (required)
- location: string (optional)
- historical_era: string (optional)
- thumbnail: file (JPEG)
- model: file (GLB)
- timestamp: string (ISO 8601)

Response: 201 Created
{
  "id": 1234567890,
  "name": "Test Monument",
  "thumbnail_url": "/uploads/thumbnails/monument-1234567890.jpg",
  ...
}
```

## 🌟 Features

### Current
- WebXR AR mode with hit-test
- Surface detection with visual feedback
- 3D model placement
- Thumbnail capture
- File upload to backend
- Real-time status updates
- Error handling

### Future Enhancements
- Cloud storage (S3/Cloudinary)
- Database persistence
- Custom model upload
- Multiple photo capture
- GPS location tracking
- AR measurements
- Offline support

## 📊 Browser Support

| Browser | Android | iOS |
|---------|---------|-----|
| Chrome | ✅ Yes | ❌ No |
| Edge | ✅ Yes | ❌ No |
| Safari | ❌ No | ❌ No |
| Firefox | ❌ No | ❌ No |

## 💡 Tips

1. **Good Lighting**: AR works best in well-lit environments
2. **Textured Surfaces**: Plain white surfaces are harder to detect
3. **Stable Device**: Keep device steady while scanning
4. **Distance**: Stand 1-2 meters from the surface
5. **Movement**: Move device slowly to scan the area

## 🎯 Success Criteria

You'll know it's working when:
- ✅ Camera opens in AR mode
- ✅ Green ring appears on surfaces
- ✅ Model places when you tap
- ✅ Success message shows
- ✅ New monument appears in grid
- ✅ Thumbnail file saved to disk

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check backend logs
3. Verify device compatibility: https://developers.google.com/ar/devices
4. Test WebXR support: https://immersiveweb.dev/

## 🎉 Ready to Test!

Everything is set up and ready. Just start the servers and test on an AR-capable device with HTTPS enabled.

For detailed technical information, see:
- `AR_SCANNER_IMPLEMENTATION.md` - Full implementation details
- `AR_SCANNER_TESTING.md` - Comprehensive testing guide
