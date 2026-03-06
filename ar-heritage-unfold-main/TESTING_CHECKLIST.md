# AR Scanner Testing Checklist

## Pre-Testing Setup

### ✅ Environment Setup
- [ ] Node.js installed (v16+)
- [ ] npm packages installed in frontend
- [ ] npm packages installed in backend
- [ ] Uploads directories created

### ✅ Server Configuration
- [ ] Backend .env file configured (PORT=5001)
- [ ] Frontend .env.local file configured (VITE_API_URL=http://localhost:5001)
- [ ] CORS origins configured in backend

### ✅ Device Requirements
- [ ] Android device with ARCore support
- [ ] Chrome or Edge browser installed
- [ ] Device connected to same network (for local testing)
- [ ] HTTPS setup ready (ngrok or self-signed cert)

## Testing Steps

### 1. Backend Server
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Server running on port 5001
- [ ] Health check responds: `curl http://localhost:5001/health`
- [ ] Monuments endpoint responds: `curl http://localhost:5001/api/monuments`
- [ ] No errors in console

### 2. Frontend Server
- [ ] Start frontend: `npm run dev`
- [ ] Server running on port 8080
- [ ] App loads in browser
- [ ] No console errors
- [ ] Navigate to /explore-heritage

### 3. HTTPS Setup (Required for AR)
- [ ] ngrok installed OR self-signed cert configured
- [ ] HTTPS tunnel running: `ngrok http 8080`
- [ ] HTTPS URL accessible
- [ ] Certificate accepted (if self-signed)
- [ ] Device can access HTTPS URL

### 4. UI Testing (Desktop)
- [ ] "Add New Heritage" button visible
- [ ] Button opens modal on click
- [ ] Form fields render correctly
- [ ] Form validation works (try submitting empty)
- [ ] "AR Not Supported" warning shows on desktop
- [ ] Cancel button closes modal

### 5. AR Testing (Mobile Device)

#### 5.1 Initial Setup
- [ ] Open HTTPS URL on Android device
- [ ] Navigate to /explore-heritage
- [ ] Click "Add New Heritage" button
- [ ] Modal opens

#### 5.2 Form Submission
- [ ] Fill in monument name (required)
- [ ] Fill in description (required)
- [ ] Fill in location (optional)
- [ ] Fill in historical era (optional)
- [ ] No "AR Not Supported" warning
- [ ] "Start AR Scanning" button enabled
- [ ] Click "Start AR Scanning"

#### 5.3 Camera Permissions
- [ ] Browser requests camera permission
- [ ] Grant permission
- [ ] Camera feed appears
- [ ] No permission errors

#### 5.4 AR Session
- [ ] AR mode starts successfully
- [ ] Camera feed is clear
- [ ] UI overlay visible
- [ ] "Tap screen to place monument" message shows
- [ ] No console errors

#### 5.5 Surface Detection
- [ ] Point camera at flat surface (floor, table)
- [ ] Green ring (reticle) appears on surface
- [ ] Reticle follows surface as device moves
- [ ] Reticle disappears when not pointing at surface
- [ ] Reticle is smooth and responsive

#### 5.6 Model Placement
- [ ] Tap screen when reticle is visible
- [ ] 3D model appears at tap location
- [ ] Model is correctly positioned on surface
- [ ] Model stays anchored to surface
- [ ] Reticle disappears after placement
- [ ] Model is visible and rendered correctly

#### 5.7 Capture & Upload
- [ ] "Capturing monument data..." message shows
- [ ] Wait 1-2 seconds
- [ ] "Uploading to heritage database..." message shows
- [ ] Upload completes without errors
- [ ] Success message displays
- [ ] Modal closes automatically

#### 5.8 Verification
- [ ] Monument list refreshes
- [ ] New monument appears in grid
- [ ] Monument card shows:
  - [ ] Thumbnail image
  - [ ] Monument name
  - [ ] Location
  - [ ] Historical era
  - [ ] "View in AR" button
  - [ ] "Details" button

### 6. Backend Verification
- [ ] Check backend console logs
- [ ] See "✅ Thumbnail saved: ..." message
- [ ] Check uploads directory: `ls -la backend/uploads/thumbnails/`
- [ ] Thumbnail file exists
- [ ] File size is reasonable (not 0 bytes)
- [ ] Filename format: monument-[timestamp].jpg

### 7. Error Handling

#### 7.1 No AR Support
- [ ] Test on desktop browser
- [ ] Warning message shows
- [ ] Button is disabled
- [ ] Clear error message

#### 7.2 Camera Permission Denied
- [ ] Deny camera permission
- [ ] Error toast shows
- [ ] Returns to form step
- [ ] Can retry

#### 7.3 Network Error
- [ ] Stop backend server
- [ ] Try to upload
- [ ] Error toast shows
- [ ] Error message is clear
- [ ] Can retry after restarting backend

#### 7.4 Invalid Form Data
- [ ] Submit form with empty name
- [ ] Validation error shows
- [ ] Form doesn't submit
- [ ] Error message is clear

### 8. Edge Cases

#### 8.1 Multiple Uploads
- [ ] Upload first monument
- [ ] Immediately upload second monument
- [ ] Both appear in list
- [ ] No conflicts or errors

#### 8.2 Cancel During Scanning
- [ ] Start AR scanning
- [ ] Click cancel button
- [ ] AR session ends
- [ ] Returns to form
- [ ] Can restart

#### 8.3 Poor Lighting
- [ ] Test in dim lighting
- [ ] Reticle may not appear
- [ ] Move to better lighting
- [ ] Reticle appears

#### 8.4 No Flat Surfaces
- [ ] Point at walls or curved surfaces
- [ ] Reticle doesn't appear
- [ ] Point at flat surface
- [ ] Reticle appears

### 9. Performance

#### 9.1 AR Performance
- [ ] AR session starts within 2-3 seconds
- [ ] Reticle updates smoothly (60fps)
- [ ] No lag or stuttering
- [ ] Model loads quickly

#### 9.2 Upload Performance
- [ ] Thumbnail capture is instant
- [ ] Upload completes within 2-3 seconds
- [ ] No timeout errors
- [ ] UI remains responsive

### 10. Cross-Browser Testing

#### 10.1 Chrome Android
- [ ] All features work
- [ ] AR session starts
- [ ] Surface detection works
- [ ] Upload succeeds

#### 10.2 Edge Android
- [ ] All features work
- [ ] AR session starts
- [ ] Surface detection works
- [ ] Upload succeeds

#### 10.3 Safari iOS (Expected to Fail)
- [ ] "AR Not Supported" warning shows
- [ ] Button is disabled
- [ ] Clear message about browser support

## Post-Testing Verification

### ✅ Data Integrity
- [ ] Monument data saved correctly
- [ ] Thumbnail URL is valid
- [ ] Thumbnail is accessible via URL
- [ ] Monument appears in GET /api/monuments

### ✅ File System
- [ ] Thumbnails directory contains files
- [ ] File permissions are correct
- [ ] Files are not corrupted
- [ ] File sizes are reasonable

### ✅ Cleanup
- [ ] No memory leaks
- [ ] AR session properly disposed
- [ ] No lingering WebXR sessions
- [ ] Browser console is clean

## Known Issues & Limitations

### Expected Limitations
- [ ] iOS devices not supported (WebXR not available)
- [ ] Firefox not supported (WebXR not available)
- [ ] Desktop browsers show warning (no AR support)
- [ ] Requires HTTPS (WebXR security requirement)

### Potential Issues
- [ ] Reticle may not appear on reflective surfaces
- [ ] Poor lighting affects surface detection
- [ ] Large models may take time to load
- [ ] Upload may fail on slow networks

## Success Criteria

### ✅ Minimum Viable Product
- [ ] AR session starts on supported devices
- [ ] Surface detection shows reticle
- [ ] Model places on tap
- [ ] Thumbnail captures successfully
- [ ] Upload completes without errors
- [ ] Monument appears in list

### ✅ User Experience
- [ ] Clear instructions at each step
- [ ] Smooth transitions between steps
- [ ] Helpful error messages
- [ ] No confusing UI states
- [ ] Responsive and fast

### ✅ Technical Quality
- [ ] No console errors
- [ ] No memory leaks
- [ ] Proper error handling
- [ ] Clean code structure
- [ ] Good performance

## Bug Report Template

If you find issues, report them with:

```
**Issue**: [Brief description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Device**: [Android version, device model]
**Browser**: [Chrome/Edge version]
**Console Errors**: [Any errors from console]
**Screenshots**: [If applicable]
```

## Testing Complete! 🎉

Once all items are checked:
- [ ] All critical features work
- [ ] No blocking bugs found
- [ ] Performance is acceptable
- [ ] User experience is smooth
- [ ] Documentation is accurate

**Status**: Ready for Production ✅

---

**Testing Date**: _____________  
**Tested By**: _____________  
**Device Used**: _____________  
**Browser Version**: _____________  
**Result**: ☐ Pass  ☐ Fail  ☐ Needs Work
