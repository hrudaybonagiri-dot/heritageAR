# AR Surface Detection & Placement Guide

## Overview

The AR Heritage platform now includes full WebXR hit-test integration for detecting surfaces and placing 3D models in augmented reality. Users can point their device at any flat surface and tap to place historical monuments in their real environment.

## Features Implemented

### ✅ Surface Detection
- Real-time hit-testing using WebXR API
- Detects horizontal and vertical surfaces
- Visual reticle indicator shows placement location
- Continuous surface tracking

### ✅ Model Placement
- Tap-to-place interaction
- Automatic model scaling for AR
- Proper positioning on detected surfaces
- Single placement per session

### ✅ Visual Feedback
- White ring reticle shows where model will be placed
- Reticle follows detected surfaces
- Status messages guide user through process
- Toast notifications for key events

### ✅ User Experience
- Clear instructions in info panel
- Step-by-step AR workflow
- Animated status badges
- Smooth transitions

## How It Works

### 1. AR Session Initialization

When user clicks "Start AR":
```typescript
// WebXR session starts with hit-test feature
renderer.xr.enabled = true;
ARButton.createButton(renderer, {
  requiredFeatures: ['hit-test'],
  optionalFeatures: ['dom-overlay']
});
```

### 2. Hit-Test Source Request

```typescript
// Request hit-test source from viewer space
session.requestReferenceSpace('viewer').then((viewerSpace) => {
  session.requestHitTestSource({ space: viewerSpace }).then((source) => {
    hitTestSourceRef.current = source;
  });
});
```

### 3. Continuous Surface Detection

```typescript
// In animation loop
const hitTestResults = frame.getHitTestResults(hitTestSource);
if (hitTestResults.length > 0) {
  const hit = hitTestResults[0];
  const pose = hit.getPose(referenceSpace);
  // Update reticle position
  reticle.matrix.fromArray(pose.transform.matrix);
  reticle.visible = true;
}
```

### 4. Model Placement on Tap

```typescript
controller.addEventListener('select', () => {
  if (reticle.visible && !arPlaced) {
    // Place model at reticle position
    model.position.setFromMatrixPosition(reticle.matrix);
    model.visible = true;
    arPlaced = true;
    reticle.visible = false;
  }
});
```

## User Workflow

### Step-by-Step Process

1. **Open AR Viewer**
   - Navigate to any monument
   - Click "View in AR"

2. **Check AR Support**
   - "AR Ready" badge appears if supported
   - Instructions shown in info panel

3. **Start AR Mode**
   - Click "Start AR" button
   - Grant camera permission when prompted

4. **Scan Environment**
   - Point camera at flat surface (floor, table, ground)
   - Move device slowly to help detect surfaces
   - White ring reticle appears when surface detected

5. **Place Monument**
   - Tap screen when reticle is visible
   - Monument appears at reticle location
   - Status changes to "Monument Placed"

6. **Explore**
   - Walk around monument to view from all angles
   - Monument stays anchored to real-world position
   - Lighting adapts to environment

7. **Exit AR**
   - Click "Exit AR" button
   - Returns to normal 3D viewer mode

## Visual Elements

### Reticle (Placement Indicator)

**Appearance:**
- White ring (15-20cm diameter)
- Flat on detected surface
- Follows surface as you move
- Disappears after placement

**Purpose:**
- Shows where monument will be placed
- Confirms surface detection
- Provides visual feedback

**Behavior:**
- Visible: Surface detected, ready to place
- Hidden: No surface detected or already placed

### Status Badges

**"Point at a surface and tap to place"**
- Animated pulse effect
- Shows during surface scanning
- Primary color background

**"Monument Placed - Walk around to explore"**
- Green background
- Shows after successful placement
- Confirms placement success

### AR Button

**Appearance:**
- Green background (#4CAF50)
- White text
- Rounded corners
- Bottom center position

**States:**
- "Start AR": Before AR session
- "Exit AR": During AR session

## Technical Details

### WebXR Hit-Test API

**Required Features:**
```javascript
{
  requiredFeatures: ['hit-test'],
  optionalFeatures: ['dom-overlay']
}
```

**Hit-Test Source:**
- Created from viewer reference space
- Provides continuous surface detection
- Returns array of hit-test results

**Hit-Test Results:**
- Contains pose (position + orientation)
- Transform matrix for placement
- Multiple results possible (uses first)

### Model Scaling

**3D Viewer Mode:**
```typescript
const scale = 3 / maxDim; // Larger for desktop viewing
model.scale.multiplyScalar(scale);
```

**AR Mode:**
```typescript
const scale = 0.5; // Smaller for real-world placement
model.scale.set(scale, scale, scale);
```

### Coordinate Systems

**3D Viewer:**
- Origin at (0, 0, 0)
- Y-up coordinate system
- Grid helper for reference

**AR Mode:**
- Origin at device position
- Real-world coordinates
- No grid (uses real environment)

## Device Requirements

### Minimum Requirements

**Android:**
- Android 8.0 (Oreo) or higher
- ARCore support
- Chrome 79+ or Edge 79+
- Rear camera

**iOS:**
- iOS 15.4 or higher
- ARKit support
- Safari 15.4+
- Rear camera

### Recommended Specifications

**Android:**
- Android 10+
- 4GB RAM
- Recent Snapdragon/Exynos processor
- Good lighting conditions

**iOS:**
- iOS 16+
- iPhone 8 or newer
- iPad Pro (2018+)
- Good lighting conditions

## Best Practices

### For Users

1. **Lighting:**
   - Use in well-lit environments
   - Avoid direct sunlight
   - Indoor lighting works best

2. **Surfaces:**
   - Use flat, textured surfaces
   - Avoid reflective surfaces (glass, mirrors)
   - Larger surfaces work better

3. **Movement:**
   - Move device slowly when scanning
   - Keep camera steady when placing
   - Walk around after placement

4. **Distance:**
   - Stand 1-3 meters from surface
   - Not too close or too far
   - Adjust based on monument size

### For Developers

1. **Model Optimization:**
   - Keep models under 10MB
   - Use compressed textures
   - Optimize polygon count (<100K)

2. **Scaling:**
   - Test different scale values
   - Consider real-world size
   - Adjust based on monument type

3. **Performance:**
   - Monitor frame rate
   - Optimize lighting
   - Reduce draw calls

4. **Error Handling:**
   - Graceful fallback if AR fails
   - Clear error messages
   - Alternative 3D view always available

## Troubleshooting

### Reticle Not Appearing

**Possible Causes:**
1. No flat surface in view
2. Poor lighting conditions
3. Surface too reflective
4. Camera permission denied

**Solutions:**
1. Point at floor or table
2. Improve lighting
3. Use textured surface
4. Grant camera permission

### Model Not Placing

**Possible Causes:**
1. Reticle not visible
2. Tapping outside reticle
3. Already placed
4. Session error

**Solutions:**
1. Wait for reticle to appear
2. Tap when reticle visible
3. Exit and restart AR
4. Check browser console

### Model Too Large/Small

**Possible Causes:**
1. Incorrect scale factor
2. Model not optimized
3. Distance from surface

**Solutions:**
1. Adjust scale in code
2. Re-export model with proper scale
3. Move closer/farther from surface

### Performance Issues

**Possible Causes:**
1. Model too complex
2. Too many lights
3. High-resolution textures
4. Device limitations

**Solutions:**
1. Optimize model geometry
2. Reduce light count
3. Compress textures
4. Use lower quality settings

## Code Reference

### Key Components

**State Management:**
```typescript
const [isARMode, setIsARMode] = useState(false);
const [arPlaced, setArPlaced] = useState(false);
const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
const reticleRef = useRef<THREE.Mesh | null>(null);
```

**Reticle Creation:**
```typescript
const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32)
  .rotateX(-Math.PI / 2);
const reticleMaterial = new THREE.MeshBasicMaterial({ 
  color: 0xffffff, 
  side: THREE.DoubleSide 
});
const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
reticle.matrixAutoUpdate = false;
reticle.visible = false;
```

**Hit-Test Loop:**
```typescript
if (hitTestSourceRef.current && frame) {
  const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
  if (hitTestResults.length > 0) {
    const hit = hitTestResults[0];
    const pose = hit.getPose(referenceSpace);
    if (pose) {
      reticle.visible = !arPlaced;
      reticle.matrix.fromArray(pose.transform.matrix);
    }
  }
}
```

**Placement Handler:**
```typescript
const onSelect = () => {
  if (!reticle.visible || !model || arPlaced) return;
  
  model.position.setFromMatrixPosition(reticle.matrix);
  model.visible = true;
  model.scale.set(0.5, 0.5, 0.5);
  
  setArPlaced(true);
  reticle.visible = false;
};
```

## Testing

### Desktop Testing

1. **Chrome DevTools:**
   - Use WebXR API Emulator extension
   - Simulate AR device
   - Test hit-test without hardware

2. **Console Logging:**
   - Monitor hit-test results
   - Check pose data
   - Verify placement coordinates

### Mobile Testing

1. **Real Device:**
   - Test on actual AR-capable device
   - Try different surfaces
   - Test in various lighting

2. **Remote Debugging:**
   - Chrome DevTools remote debugging
   - Safari Web Inspector (iOS)
   - Monitor performance

## Performance Metrics

### Target Metrics

- **Frame Rate:** 30-60 FPS
- **Hit-Test Latency:** <50ms
- **Placement Accuracy:** ±5cm
- **Model Load Time:** <3 seconds

### Monitoring

```javascript
// FPS counter
let lastTime = performance.now();
let frames = 0;

renderer.setAnimationLoop(() => {
  frames++;
  const now = performance.now();
  if (now >= lastTime + 1000) {
    const fps = Math.round((frames * 1000) / (now - lastTime));
    console.log(`FPS: ${fps}`);
    frames = 0;
    lastTime = now;
  }
});
```

## Future Enhancements

### Planned Features

- [ ] Multiple model placement
- [ ] Model rotation in AR
- [ ] Scale adjustment gestures
- [ ] Persistent anchors (save placement)
- [ ] Occlusion (real objects hide virtual)
- [ ] Lighting estimation
- [ ] Plane visualization
- [ ] Measurement tools
- [ ] Screenshot/video capture
- [ ] Social sharing

### Advanced Features

- [ ] Image target tracking
- [ ] Face tracking
- [ ] Hand tracking
- [ ] Multi-user AR
- [ ] Cloud anchors
- [ ] Spatial audio

## Resources

### Documentation
- [WebXR Hit-Test](https://immersive-web.github.io/hit-test/)
- [Three.js WebXR](https://threejs.org/docs/#api/en/renderers/webxr/WebXRManager)
- [ARCore](https://developers.google.com/ar)
- [ARKit](https://developer.apple.com/augmented-reality/)

### Tools
- [WebXR Emulator](https://github.com/MozillaReality/WebXR-emulator-extension)
- [Three.js Editor](https://threejs.org/editor/)
- [glTF Viewer](https://gltf-viewer.donmccurdy.com/)

## Support

### Browser Support

| Browser | Platform | Hit-Test | Status |
|---------|----------|----------|--------|
| Chrome 79+ | Android | ✅ | Full support |
| Safari 15.4+ | iOS | ✅ | Full support |
| Edge 79+ | Android | ✅ | Full support |
| Firefox | All | ❌ | Not yet |

### Getting Help

1. Check browser console for errors
2. Verify device compatibility
3. Test with sample models
4. Review WebXR documentation
5. Check platform-specific guides

## Success Criteria

✅ **Implementation Complete When:**

- Reticle appears on detected surfaces
- Tap places model at reticle location
- Model stays anchored after placement
- Clear visual feedback throughout
- Works on AR-capable devices
- Graceful fallback for non-AR devices
- Performance acceptable (30+ FPS)
- User instructions clear

## Status

✅ **Surface Detection & Placement: FULLY IMPLEMENTED**

- Hit-test API integrated
- Reticle visualization working
- Tap-to-place functional
- Visual feedback complete
- Instructions provided
- TypeScript types defined
- Tested and working

**Ready for production use on AR-capable devices!** 🎉

