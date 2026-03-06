# AR Scanner - Quick Reference Card

## 🚀 Start Servers

```bash
# Backend (port 5001)
cd ar-heritage-unfold-main/backend && npm run dev

# Frontend (port 8080)
cd ar-heritage-unfold-main && npm run dev
```

## 🔗 URLs

- **Frontend**: http://localhost:8080
- **Explore Heritage**: http://localhost:8080/explore-heritage
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

## 📱 Testing Requirements

- ✅ AR-capable Android device (ARCore)
- ✅ Chrome or Edge browser
- ✅ HTTPS connection (use ngrok)

## 🔒 Enable HTTPS

```bash
ngrok http 8080
# Use the HTTPS URL on your device
```

## 🎯 Test Flow

1. Click **"Add New Heritage"** button
2. Fill form (name + description required)
3. Click **"Start AR Scanning"**
4. Point at flat surface
5. Look for **green ring**
6. **Tap screen** to place
7. Wait for auto-upload
8. See success message

## 📁 Key Files

```
src/
├── utils/arScanner.ts              # AR logic
├── services/monumentService.ts     # API calls
├── components/ARScannerModal.tsx   # UI modal
└── pages/ExploreHeritage.tsx       # Main page

backend/
├── src/server-simple.js            # API endpoint
└── uploads/
    ├── thumbnails/                 # Saved images
    └── models/                     # Saved models
```

## 🔍 Verify Upload

```bash
# Check saved files
ls -la backend/uploads/thumbnails/

# Check backend logs
# Look for: "✅ Thumbnail saved: ..."
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "AR Not Supported" | Use Android + Chrome + HTTPS |
| Camera won't open | Grant permissions, reload page |
| No green ring | Move device, better lighting |
| Upload fails | Check backend running on 5001 |
| Model won't place | Wait for ring, tap screen |

## 📊 API Endpoint

```
POST /api/monuments
Content-Type: multipart/form-data

Required:
- name (string)
- description (string)

Optional:
- location (string)
- historical_era (string)
- thumbnail (file)
- model (file)
```

## ✅ Success Indicators

- ✅ Camera opens in AR mode
- ✅ Green ring on surfaces
- ✅ Model places on tap
- ✅ Success message shows
- ✅ Monument in grid
- ✅ File in uploads/thumbnails/

## 📚 Documentation

- **AR_SCANNER_README.md** - Quick start
- **AR_SCANNER_TESTING.md** - Full testing guide
- **AR_SCANNER_IMPLEMENTATION.md** - Technical details
- **TASK_COMPLETION_SUMMARY.md** - What was built

## 🎯 Status

✅ **COMPLETE** - Ready for device testing

## 💡 Tips

- Use well-lit environments
- Point at textured surfaces
- Keep device steady
- Stand 1-2 meters away
- Move slowly when scanning

---

**Need Help?** Check the full documentation files above.
