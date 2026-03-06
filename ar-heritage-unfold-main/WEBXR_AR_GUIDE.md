# WebXR AR Mode Guide

## Overview

The AR Heritage platform now supports WebXR for true augmented reality experiences on compatible devices. Users can view 3D monument models in their real-world environment using their device's camera.

## Features

### ✅ Implemented

1. **WebXR Integration**
   - Three.js WebXR support enabled
   - AR session management
   - Hit-test support for placing models
   - DOM overlay for UI elements

2. **GLB Model Loading**
   - Optimized .glb format support
   - Progress tracking during load
   - Error handling with fallback
   - Automatic model scaling and centering

3. **AR Mode Detection**
   - Automatic AR capability detection
   - Visual indicators for AR support
   - Graceful fallback for non-AR devices

4. **User Interface**
   - AR button automatically generated
   - AR status indicators
   - Mode-aware controls (hidden in AR)
   - Loading states and feedback

## Device Requirements

### Compatible Devices

#### Mobile Devices (Recommended)
- **Android**: 
  - Android 8.0+ with ARCore support
  - Chrome 79+ or Edge 79+
  - Devices: Pixel, Samsung Galaxy S8+, OnePlus 6+, etc.

- **iOS**:
  - iOS 15.4+ (WebXR support added)
  - Safari 15.4+
  - Devices: iPhone 6S and newer, iPad Pro

#### Desktop (Limited AR)
- Chrome/Edge with AR-capable webcam
- Windows Mixed Reality headsets
- Magic Leap, HoloLens (experimental)

### Browser Support

| Browser | Platform | AR Support |
|---------|----------|------------|
| Chrome 79+ | Android | ✅ Full |
| Chrome | Desktop | ⚠️ Limited |
| Safari 15.4+ | iOS | ✅ Full |
| Edge 79+ | Android | ✅ Full |
| Firefox | All | ❌ Not yet |

## How to Use AR Mode

### On Mobile Devices

1. **Open the AR Viewer**
   - Navigate to any monument
   - Click "View in AR"

2. **Check AR Support**
   - Look for "AR Ready" badge in top-left
   - "Start AR" button will appear at bottom

3. **Enter AR Mode**
   - Click the "Start AR" button
   - Grant camera permissions when prompted
   - Point camera at a flat surface

4. **Place the Model**
   - Move device to scan the environment
   - Tap on a detected surface to place model
   - Model appears in your real environment

5. **Interact**
   - Walk around to view from different angles
   - Pinch to scale (if supported)
   - Tap to reposition

6. **Exit AR**
   - Click "Exit AR" button
   - Returns to normal 3D viewer

### On Desktop

1. **Limited AR Support**
   - Desktop AR requires special hardware
   - Most users will see standard 3D viewer
   - Use mouse controls for interaction

## Technical Implementation

### WebXR Setup

```typescript
// Enable WebXR in renderer
renderer.xr.enabled = true;

// Create AR button
const arButton = ARButton.createButton(renderer, {
  requiredFeatures: ['hit-test'],
  optionalFeatures: ['dom-overlay'],
  domOverlay: { root: document.body }
});

// Listen for AR session events
renderer.xr.addEventListener('sessionstart', () => {
  // AR mode started
});

renderer.xr.addEventListener('sessionend', () => {
  // AR mode ended
});
```

### GLB Model Loading

```typescript
const loader = new GLTFLoader();
loader.load(
  modelUrl,
  (gltf) => {
    const model = gltf.scene;
    // Enable shadows
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    // Auto-scale and center
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    scene.add(model);
  }
);
```

### Animation Loop

```typescript
renderer.setAnimationLoop(() => {
  // Update controls only in non-AR mode
  if (!renderer.xr.isPresenting && controls) {
    controls.update();
  }
  
  // Hide grid in AR mode
  const grid = scene.getObjectByName('grid');
  if (grid) {
    grid.visible = !renderer.xr.isPresenting;
  }
  
  renderer.render(scene, camera);
});
```

## GLB Model Requirements

### Recommended Specifications

- **File Size**: Under 10MB for mobile
- **Polygons**: Under 100K triangles
- **Textures**: 
  - Max 2048x2048 resolution
  - Use compressed formats (JPEG for color, PNG for alpha)
- **Format**: GLB (binary GLTF)
- **Optimization**: Use glTF-Pipeline or similar tools

### Model Preparation

1. **Export from 3D Software**
   - Blender: File → Export → glTF 2.0 (.glb)
   - Maya: Use glTF exporter plugin
   - 3ds Max: Use Babylon.js exporter

2. **Optimize**
   ```bash
   # Using gltf-pipeline
   gltf-pipeline -i model.glb -o model-optimized.glb -d
   ```

3. **Test**
   - Use glTF Viewer: https://gltf-viewer.donmccurdy.com/
   - Check file size and performance

### Sample GLB Models

The platform uses sample models from Khronos glTF repository:
- Damaged Helmet: ~3MB, good detail
- Lantern: ~1MB, optimized
- More samples: https://github.com/KhronosGroup/glTF-Sample-Models

## Features by Mode

### Standard 3D Viewer Mode

- ✅ Mouse/touch controls
- ✅ Zoom, rotate, pan
- ✅ Grid helper
- ✅ Control buttons
- ✅ Info panel
- ✅ All lighting

### AR Mode

- ✅ Real-world placement
- ✅ Camera passthrough
- ✅ Hit-test for surfaces
- ✅ Scale and position
- ❌ Grid hidden
- ❌ Controls disabled
- ⚠️ Simplified lighting

## Troubleshooting

### AR Button Not Appearing

**Possible Causes:**
1. Device doesn't support WebXR
2. Browser doesn't support AR
3. Not using HTTPS (required for WebXR)

**Solutions:**
- Check browser compatibility
- Update to latest browser version
- Ensure site is served over HTTPS
- Check console for errors

### Camera Permission Denied

**Solution:**
1. Go to browser settings
2. Find site permissions
3. Enable camera access
4. Reload page

### Model Not Loading

**Possible Causes:**
1. Invalid GLB file
2. File too large
3. Network error
4. CORS issues

**Solutions:**
- Validate GLB file
- Optimize model size
- Check network connection
- Ensure proper CORS headers

### AR Session Fails

**Possible Causes:**
1. Poor lighting conditions
2. No flat surfaces detected
3. ARCore/ARKit not available

**Solutions:**
- Improve lighting
- Point at flat, textured surface
- Update Google Play Services (Android)
- Update iOS (iPhone)

## Performance Optimization

### For Mobile AR

1. **Reduce Polygon Count**
   - Target: 50K triangles or less
   - Use LOD (Level of Detail) if needed

2. **Optimize Textures**
   - Compress textures
   - Use power-of-2 dimensions
   - Combine texture maps

3. **Simplify Materials**
   - Limit material count
   - Use simple shaders
   - Avoid transparency when possible

4. **Lighting**
   - Use baked lighting
   - Limit real-time lights
   - Use ambient occlusion maps

### Testing Performance

```javascript
// Monitor FPS
const stats = new Stats();
document.body.appendChild(stats.dom);

renderer.setAnimationLoop(() => {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();
});
```

## Security Considerations

### HTTPS Required

WebXR requires HTTPS for security:
- Development: Use localhost (allowed)
- Production: Must use HTTPS
- Self-signed certificates won't work

### Permissions

AR mode requires:
- Camera access
- Motion sensors (accelerometer, gyroscope)
- User must grant permissions

### Privacy

- Camera feed stays on device
- No video recording by default
- User controls when AR is active

## Future Enhancements

### Planned Features

- [ ] Multi-marker tracking
- [ ] Image target recognition
- [ ] Persistent AR anchors
- [ ] Shared AR experiences
- [ ] AR annotations
- [ ] Measurement tools
- [ ] Screenshot/video capture
- [ ] Social sharing from AR

### Advanced AR Features

- [ ] Occlusion (real objects hide virtual)
- [ ] Lighting estimation
- [ ] Plane detection
- [ ] Face tracking
- [ ] Hand tracking
- [ ] World understanding

## Development Tips

### Local Testing

1. **Use HTTPS locally**
   ```bash
   # Vite with HTTPS
   vite --https
   ```

2. **Mobile debugging**
   - Chrome DevTools remote debugging
   - Safari Web Inspector (iOS)

3. **AR Emulator**
   - WebXR API Emulator extension
   - Test without AR device

### Best Practices

1. **Progressive Enhancement**
   - Provide fallback for non-AR devices
   - Detect capabilities before enabling features

2. **User Guidance**
   - Show instructions for first-time users
   - Provide visual feedback during scanning

3. **Error Handling**
   - Graceful degradation
   - Clear error messages
   - Retry mechanisms

4. **Performance**
   - Monitor frame rate
   - Optimize for 60 FPS
   - Test on low-end devices

## Resources

### Documentation
- [WebXR Device API](https://www.w3.org/TR/webxr/)
- [Three.js WebXR](https://threejs.org/docs/#api/en/renderers/webxr/WebXRManager)
- [glTF 2.0 Specification](https://www.khronos.org/gltf/)

### Tools
- [glTF Viewer](https://gltf-viewer.donmccurdy.com/)
- [glTF-Pipeline](https://github.com/CesiumGS/gltf-pipeline)
- [WebXR Emulator](https://github.com/MozillaReality/WebXR-emulator-extension)

### Sample Models
- [Khronos glTF Samples](https://github.com/KhronosGroup/glTF-Sample-Models)
- [Sketchfab](https://sketchfab.com/) (filter by glTF)
- [Poly Haven](https://polyhaven.com/)

## Support

For AR-related issues:
1. Check device compatibility
2. Verify browser support
3. Test with sample models
4. Check console for errors
5. Review WebXR documentation

## Status

✅ **WebXR AR Mode: FULLY IMPLEMENTED**

- GLB model loading working
- AR button auto-generated
- Session management complete
- Mode detection functional
- UI adapts to AR mode
- Sample models available
- Documentation complete

Ready for testing on AR-capable devices!

