# AR Surface Detection Testing Guide

## Quick Test Checklist

### Desktop Testing (3D Viewer)

- [ ] Open http://localhost:8080/explore
- [ ] Click any monument
- [ ] Click "View in AR"
- [ ] 3D model loads and displays
- [ ] Mouse controls work (rotate, zoom, pan)
- [ ] Control buttons functional
- [ ] Info panel toggles
- [ ] No "AR Ready" badge (desktop)
- [ ] No "Start AR" button (desktop)

### Mobile Testing (AR Mode)

#### Prerequisites
- [ ] AR-capable device (Android 8+ or iOS 15.4+)
- [ ] Chrome 79+ (Android) or Safari 15.4+ (iOS)
- [ ] Good lighting conditions
- [ ] Flat surface available (floor, table)

#### Test Steps

1. **Access Site**
   - [ ] Open site on mobile browser
   - [ ] Navigate to Explore Heritage
   - [ ] Select a monument
   - [ ] Click "View in AR"

2. **Check AR Support**
   - [ ] "AR Ready" badge appears (top-left)
   - [ ] "Start AR" button visible (bottom center)
   - [ ] Info panel shows AR instructions
   - [ ] 3D model loads in viewer

3. **Enter AR Mode**
   - [ ] Click "Start AR" button
   - [ ] Camera permission prompt appears
   - [ ] Grant camera permission
   - [ ] Camera view activates
   - [ ] Status badge shows "Point at a surface and tap to place"

4. **Surface Detection**
   - [ ] Point camera at flat surface
   - [ ] Move device slowly
   - [ ] White ring reticle appears
   - [ ] Reticle follows surface
   - [ ] Reticle stays visible on surface

5. **Model Placement**
   - [ ] Tap screen when reticle visible
   - [ ] Monument appears at reticle location
   - [ ] Reticle disappears
   - [ ] Status changes to "Monument Placed"
   - [ ] Model stays anchored to surface

6. **Exploration**
   - [ ] Walk around monument
   - [ ] View from different angles
   - [ ] Model stays in place
   - [ ] Proper scale (not too big/small)
   - [ ] Lighting looks natural

7. **Exit AR**
   - [ ] Click "Exit AR" button
   - [ ] Returns to 3D viewer
   - [ ] Model resets to center
   - [ ] Controls work again

## Expected Behavior

### 3D Viewer Mode (Desktop/Mobile)

**Visual Elements:**
- 3D model centered in view
- Grid helper visible
- Control buttons at bottom
- Info panel on right (toggleable)
- Background color: light gray

**Interactions:**
- Mouse/touch drag: Rotate
- Scroll/pinch: Zoom
- Right-click drag: Pan
- Buttons: Zoom in/out, rotate, reset

### AR Mode (Mobile Only)

**Before Placement:**
- Camera passthrough visible
- White ring reticle on surfaces
- Status: "Point at a surface and tap to place"
- Model hidden
- Grid hidden

**After Placement:**
- Model visible at tap location
- Reticle hidden
- Status: "Monument Placed"
- Model anchored to real world
- Can walk around model

## Common Issues & Solutions

### Issue: "Start AR" Button Not Appearing

**Check:**
- Using mobile device?
- Browser supports WebXR?
- Device has ARCore/ARKit?

**Solution:**
- Test on compatible device
- Update browser to latest version
- Check device compatibility list

### Issue: Reticle Not Appearing

**Check:**
- Pointing at flat surface?
- Good lighting?
- Surface has texture?
- Camera permission granted?

**Solution:**
- Point at floor or table
- Improve lighting
- Use non-reflective surface
- Grant camera permission in settings

### Issue: Model Not Placing

**Check:**
- Reticle visible when tapping?
- Tapping on screen (not button)?
- Already placed?

**Solution:**
- Wait for reticle to appear
- Tap anywhere on screen
- Exit and restart AR

### Issue: Model Too Large/Small

**Check:**
- Scale factor in code
- Distance from surface
- Model original size

**Solution:**
- Adjust scale value (currently 0.5)
- Move closer/farther
- Re-export model with proper scale

### Issue: Poor Performance

**Check:**
- Model complexity
- Device capabilities
- Other apps running

**Solution:**
- Use optimized GLB models
- Close other apps
- Test on better device

## Test Scenarios

### Scenario 1: First-Time User

1. User opens app on phone
2. Navigates to monument
3. Clicks "View in AR"
4. Sees instructions in info panel
5. Clicks "Start AR"
6. Grants camera permission
7. Follows on-screen instructions
8. Successfully places monument
9. Explores from different angles
10. Exits AR satisfied

**Expected Result:** Smooth, intuitive experience

### Scenario 2: Different Surfaces

Test placement on:
- [ ] Floor (carpet)
- [ ] Floor (hardwood)
- [ ] Table (wood)
- [ ] Table (glass) - may not work
- [ ] Ground (outdoor)
- [ ] Wall (vertical) - should work

**Expected Result:** Works on most flat surfaces

### Scenario 3: Different Lighting

Test in:
- [ ] Bright indoor lighting
- [ ] Dim indoor lighting
- [ ] Outdoor daylight
- [ ] Outdoor shade
- [ ] Direct sunlight - may struggle

**Expected Result:** Works in most lighting conditions

### Scenario 4: Multiple Monuments

1. Place first monument
2. Exit AR
3. Go back to Explore
4. Select different monument
5. Enter AR again
6. Place second monument

**Expected Result:** Each monument works independently

## Performance Benchmarks

### Target Metrics

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| FPS | 60 | 30-60 | <30 |
| Load Time | <2s | 2-5s | >5s |
| Hit-Test Latency | <50ms | 50-100ms | >100ms |
| Placement Accuracy | ±5cm | ±10cm | >10cm |

### How to Measure

**FPS:**
- Check browser DevTools
- Look for frame drops
- Should feel smooth

**Load Time:**
- Time from "View in AR" to model visible
- Should be quick

**Hit-Test Latency:**
- Reticle should follow surface smoothly
- No noticeable lag

**Placement Accuracy:**
- Model should appear exactly where reticle was
- Should stay anchored

## Browser Console Checks

### Expected Console Output

```
Loading: 100.00%
Model Loaded
AR Mode Started
Hit-test source requested
Hit-test results: [XRHitTestResult]
Monument Placed!
```

### Error Messages to Watch For

```
❌ WebXR not supported
❌ AR session failed
❌ Hit-test not available
❌ Camera permission denied
❌ Model load failed
```

## Device Compatibility

### Tested Devices

**Android:**
- [ ] Google Pixel 4+
- [ ] Samsung Galaxy S10+
- [ ] OnePlus 6+
- [ ] Xiaomi Mi 9+

**iOS:**
- [ ] iPhone 8+
- [ ] iPhone SE (2020+)
- [ ] iPad Pro (2018+)
- [ ] iPad Air (2020+)

### Known Issues

**Android:**
- Some budget devices may not support ARCore
- Performance varies by device
- Chrome required (not Firefox)

**iOS:**
- Requires iOS 15.4+ for WebXR
- Safari only (not Chrome)
- Older devices may struggle

## Automated Testing

### Unit Tests (Future)

```typescript
describe('AR Surface Detection', () => {
  test('reticle appears on surface detection', () => {
    // Test reticle visibility
  });
  
  test('model places at reticle position', () => {
    // Test placement logic
  });
  
  test('model stays anchored after placement', () => {
    // Test anchor stability
  });
});
```

### Integration Tests (Future)

```typescript
describe('AR Workflow', () => {
  test('complete AR placement flow', async () => {
    // Test full user journey
  });
});
```

## Reporting Issues

### Information to Include

1. **Device:**
   - Model name
   - OS version
   - Browser version

2. **Steps to Reproduce:**
   - What you did
   - What happened
   - What you expected

3. **Console Errors:**
   - Copy from browser console
   - Include full error message

4. **Screenshots/Video:**
   - Show the issue
   - Include UI elements

### Example Issue Report

```
Device: iPhone 12, iOS 16.5, Safari 16.5
Issue: Reticle not appearing

Steps:
1. Opened AR viewer
2. Clicked "Start AR"
3. Granted camera permission
4. Pointed at floor
5. No reticle appeared

Console: "Hit-test source not available"

Expected: White ring reticle should appear on floor
```

## Success Criteria

✅ **AR Surface Detection Working When:**

- Reticle appears on flat surfaces
- Reticle follows surface smoothly
- Tap places model at reticle location
- Model stays anchored after placement
- Performance is smooth (30+ FPS)
- Works on target devices
- Clear user feedback throughout
- Graceful error handling

## Quick Test Commands

### Check WebXR Support

```javascript
// In browser console
navigator.xr?.isSessionSupported('immersive-ar')
  .then(supported => console.log('AR Supported:', supported));
```

### Check Hit-Test Feature

```javascript
// During AR session
session.requestHitTestSource({ space: viewerSpace })
  .then(() => console.log('Hit-test available'))
  .catch(err => console.error('Hit-test not available:', err));
```

### Monitor Frame Rate

```javascript
// In browser console
let lastTime = performance.now();
let frames = 0;
setInterval(() => {
  const now = performance.now();
  const fps = Math.round((frames * 1000) / (now - lastTime));
  console.log(`FPS: ${fps}`);
  frames = 0;
  lastTime = now;
}, 1000);
```

## Next Steps After Testing

1. **Document Issues:**
   - Create issue list
   - Prioritize by severity
   - Assign for fixing

2. **Optimize Performance:**
   - Profile slow areas
   - Optimize models
   - Reduce draw calls

3. **Improve UX:**
   - Refine instructions
   - Add more feedback
   - Smooth transitions

4. **Expand Testing:**
   - More devices
   - More environments
   - Edge cases

## Status

✅ **Ready for Testing**

All features implemented and ready for comprehensive testing on AR-capable devices.

