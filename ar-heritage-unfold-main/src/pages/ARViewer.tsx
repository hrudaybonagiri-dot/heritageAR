import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Maximize2, RotateCw, ZoomIn, ZoomOut, Info, AlertCircle, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

interface Monument {
  id: number;
  name: string;
  location: string;
  historical_era: string;
  condition_status: string;
  description: string;
  model_url?: string;
  architect?: string;
  materials?: string;
}

const ARViewer = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [monument, setMonument] = useState<Monument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isARMode, setIsARMode] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [arPlaced, setArPlaced] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const arButtonRef = useRef<HTMLElement | null>(null);
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null);
  const hitTestSourceRequestedRef = useRef(false);
  const reticleRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    fetchMonument();
    checkARSupport();
  }, [id]);

  useEffect(() => {
    if (monument && containerRef.current) {
      initThreeJS();
      return () => {
        cleanup();
      };
    }
  }, [monument]);

  const checkARSupport = async () => {
    if ('xr' in navigator) {
      try {
        const supported = await (navigator as any).xr?.isSessionSupported('immersive-ar');
        setIsARSupported(supported || false);
      } catch (err) {
        console.log('AR not supported:', err);
        setIsARSupported(false);
      }
    }
  };

  const fetchMonument = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.monuments.details(id!));
      if (!response.ok) throw new Error('Monument not found');
      const data = await response.json();
      setMonument(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load monument');
    } finally {
      setLoading(false);
    }
  };

  const initThreeJS = () => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);
    cameraRef.current = camera;

    // Renderer with WebXR support
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.xr.enabled = true; // Enable WebXR
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create reticle for AR placement
    const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
    reticleRef.current = reticle;

    // Add AR Button if supported
    if (isARSupported) {
      const arButton = ARButton.createButton(renderer, {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body }
      });
      arButton.style.position = 'absolute';
      arButton.style.bottom = '80px';
      arButton.style.left = '50%';
      arButton.style.transform = 'translateX(-50%)';
      arButton.style.zIndex = '100';
      arButton.style.padding = '12px 24px';
      arButton.style.fontSize = '16px';
      arButton.style.fontWeight = 'bold';
      arButton.style.backgroundColor = '#4CAF50';
      arButton.style.color = 'white';
      arButton.style.border = 'none';
      arButton.style.borderRadius = '8px';
      arButton.style.cursor = 'pointer';
      containerRef.current.appendChild(arButton);
      arButtonRef.current = arButton;

      // Listen for AR session events
      renderer.xr.addEventListener('sessionstart', () => {
        setIsARMode(true);
        setArPlaced(false);
        if (controlsRef.current) {
          controlsRef.current.enabled = false;
        }
        toast({
          title: 'AR Mode Started',
          description: 'Point your camera at a flat surface and tap to place the monument',
        });
      });

      renderer.xr.addEventListener('sessionend', () => {
        setIsARMode(false);
        setArPlaced(false);
        hitTestSourceRef.current = null;
        hitTestSourceRequestedRef.current = false;
        if (reticleRef.current) {
          reticleRef.current.visible = false;
        }
        if (controlsRef.current) {
          controlsRef.current.enabled = true;
        }
        // Reset model position for regular 3D view
        if (modelRef.current) {
          modelRef.current.position.set(0, 0, 0);
          modelRef.current.scale.set(1, 1, 1);
        }
        toast({
          title: 'AR Mode Ended',
          description: 'Returned to 3D viewer mode',
        });
      });
    }

    // Controls (disabled in AR mode)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    scene.add(hemisphereLight);

    // Grid (hidden in AR mode)
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.name = 'grid';
    scene.add(gridHelper);

    // Load 3D Model (.glb preferred)
    if (monument?.model_url) {
      loadGLBModel(monument.model_url, scene);
    } else {
      createPlaceholderModel(scene);
    }

    // Setup select event for AR placement
    const controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);

    // Animation loop with hit-test
    renderer.setAnimationLoop((timestamp, frame) => {
      if (frame && renderer.xr.isPresenting) {
        // AR Mode
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        // Request hit test source
        if (!hitTestSourceRequestedRef.current && referenceSpace) {
          session?.requestReferenceSpace('viewer').then((viewerSpace) => {
            session?.requestHitTestSource?.({ space: viewerSpace })?.then((source) => {
              hitTestSourceRef.current = source;
            });
          });
          hitTestSourceRequestedRef.current = true;
        }

        // Perform hit test
        if (hitTestSourceRef.current && frame) {
          const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
          
          if (hitTestResults.length > 0 && reticleRef.current) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace!);
            
            if (pose) {
              reticleRef.current.visible = !arPlaced;
              reticleRef.current.matrix.fromArray(pose.transform.matrix);
            }
          } else if (reticleRef.current) {
            reticleRef.current.visible = false;
          }
        }

        // Hide grid and adjust model in AR
        const grid = scene.getObjectByName('grid');
        if (grid) grid.visible = false;
        
      } else {
        // Regular 3D Mode
        if (controls) {
          controls.update();
        }
        
        const grid = scene.getObjectByName('grid');
        if (grid) grid.visible = true;
      }
      
      renderer.render(scene, camera);
    });

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  // Handle AR placement on select (tap)
  const onSelect = () => {
    if (!reticleRef.current || !reticleRef.current.visible || !modelRef.current) return;

    if (!arPlaced) {
      // Place the model at reticle position
      const reticleMatrix = reticleRef.current.matrix;
      modelRef.current.position.setFromMatrixPosition(reticleMatrix);
      modelRef.current.visible = true;
      
      // Scale model appropriately for AR (smaller than 3D view)
      const scale = 0.5; // Adjust this value based on your model
      modelRef.current.scale.set(scale, scale, scale);
      
      setArPlaced(true);
      reticleRef.current.visible = false;
      
      toast({
        title: 'Monument Placed!',
        description: 'Walk around to view from different angles',
      });
    }
  };

  const loadGLBModel = (url: string, scene: THREE.Scene) => {
    setModelLoading(true);
    const loader = new GLTFLoader();
    
    // Support both full URLs and relative paths
    const modelUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        
        // Enable shadows
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        model.scale.multiplyScalar(scale);
        
        // In AR mode, hide model initially until placed
        if (isARMode) {
          model.visible = false;
        }
        
        // Remove old model if exists
        if (modelRef.current) {
          scene.remove(modelRef.current);
        }
        
        scene.add(model);
        modelRef.current = model;
        setModelLoading(false);
        
        toast({
          title: 'Model Loaded',
          description: isARMode 
            ? 'Point at a surface and tap to place the monument'
            : 'GLB model loaded successfully',
        });
      },
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Loading: ${percent.toFixed(2)}%`);
      },
      (error) => {
        console.error('Error loading GLB model:', error);
        setModelLoading(false);
        toast({
          title: 'Model Load Failed',
          description: 'Using placeholder model instead',
          variant: 'destructive',
        });
        createPlaceholderModel(scene);
      }
    );
  };

  const createPlaceholderModel = (scene: THREE.Scene) => {
    // Create a simple monument placeholder
    const group = new THREE.Group();

    // Base
    const baseGeometry = new THREE.BoxGeometry(2, 0.3, 2);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x8b7355 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.15;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Columns
    const columnGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);
    const columnMaterial = new THREE.MeshStandardMaterial({ color: 0xd4d4d4 });
    
    const positions = [
      [-0.7, 1.3, -0.7],
      [0.7, 1.3, -0.7],
      [-0.7, 1.3, 0.7],
      [0.7, 1.3, 0.7],
    ];

    positions.forEach(([x, y, z]) => {
      const column = new THREE.Mesh(columnGeometry, columnMaterial);
      column.position.set(x, y, z);
      column.castShadow = true;
      column.receiveShadow = true;
      group.add(column);
    });

    // Roof
    const roofGeometry = new THREE.BoxGeometry(2.2, 0.2, 2.2);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 2.4;
    roof.castShadow = true;
    roof.receiveShadow = true;
    group.add(roof);

    scene.add(group);
    modelRef.current = group;
  };

  const cleanup = () => {
    if (rendererRef.current) {
      rendererRef.current.setAnimationLoop(null);
      if (containerRef.current && rendererRef.current.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current.dispose();
    }
    if (controlsRef.current) {
      controlsRef.current.dispose();
    }
    if (arButtonRef.current && arButtonRef.current.parentNode) {
      arButtonRef.current.parentNode.removeChild(arButtonRef.current);
    }
  };

  const handleReset = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 2, 5);
      controlsRef.current.reset();
    }
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.8);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.2);
    }
  };

  const handleRotate = () => {
    if (modelRef.current) {
      modelRef.current.rotation.y += Math.PI / 4;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading 3D model...</p>
        </div>
      </div>
    );
  }

  if (error || !monument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error || 'Monument not found'}</p>
            <Button asChild>
              <Link to="/explore">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Explore
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/explore">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">{monument.name}</h1>
              <p className="text-sm text-muted-foreground">{monument.location}</p>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowInfo(!showInfo)}>
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* 3D Viewer */}
        <div className="flex-1 relative">
          <div ref={containerRef} className="w-full h-full" />
          
          {/* Loading Indicator */}
          {modelLoading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/90 backdrop-blur p-6 rounded-lg shadow-lg">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading 3D model...</p>
            </div>
          )}

          {/* AR Status Badge */}
          {isARMode && !arPlaced && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm font-semibold">Point at a surface and tap to place</span>
            </div>
          )}

          {isARMode && arPlaced && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm font-semibold">Monument Placed - Walk around to explore</span>
            </div>
          )}

          {/* AR Support Info */}
          {!isARMode && isARSupported && (
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur px-3 py-2 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">AR Ready</span>
              </div>
            </div>
          )}
          
          {/* Controls - Hidden in AR mode */}
          {!isARMode && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-background/80 backdrop-blur p-2 rounded-lg shadow-lg">
              <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleRotate} title="Rotate">
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleReset} title="Reset View">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Info Panel */}
        {showInfo && (
          <aside className="w-80 border-l bg-background overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{monument.name}</h2>
                <p className="text-muted-foreground">{monument.location}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Condition</h3>
                <Badge className={monument.condition_status === 'excellent' ? 'bg-green-500' : 
                                 monument.condition_status === 'good' ? 'bg-blue-500' :
                                 monument.condition_status === 'fair' ? 'bg-yellow-500' :
                                 monument.condition_status === 'poor' ? 'bg-orange-500' : 'bg-red-500'}>
                  {monument.condition_status}
                </Badge>
              </div>

              {monument.historical_era && (
                <div>
                  <h3 className="font-semibold mb-2">Historical Era</h3>
                  <p className="text-sm">{monument.historical_era}</p>
                </div>
              )}

              {monument.architect && (
                <div>
                  <h3 className="font-semibold mb-2">Architect</h3>
                  <p className="text-sm">{monument.architect}</p>
                </div>
              )}

              {monument.materials && (
                <div>
                  <h3 className="font-semibold mb-2">Materials</h3>
                  <p className="text-sm">{monument.materials}</p>
                </div>
              )}

              {monument.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{monument.description}</p>
                </div>
              )}

              <div className="pt-4 border-t space-y-3">
                {isARSupported && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <Smartphone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-primary mb-1">AR Mode Available</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Experience this monument in your real environment:
                        </p>
                        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                          <li>Click "Start AR" button below</li>
                          <li>Grant camera permission</li>
                          <li>Point camera at a flat surface</li>
                          <li>Tap the screen to place monument</li>
                          <li>Walk around to view from all angles</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {isARSupported 
                    ? 'Use mouse to rotate, scroll to zoom, or enter AR mode for immersive viewing.'
                    : 'Use mouse to rotate, scroll to zoom, and drag to pan the 3D model.'}
                </p>
                
                <Button asChild className="w-full">
                  <Link to={`/monument/${monument.id}`}>
                    View Full Details
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ARViewer;
