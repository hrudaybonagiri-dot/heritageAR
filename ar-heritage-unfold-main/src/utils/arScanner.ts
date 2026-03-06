// AR Scanner Utility for Monument Scanning
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface ScanResult {
  thumbnail: Blob;
  timestamp: Date;
  position?: { x: number; y: number; z: number };
}

export class ARScanner {
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private reticle: THREE.Mesh | null = null;
  private model: THREE.Group | null = null;
  private hitTestSource: XRHitTestSource | null = null;
  private hitTestSourceRequested = false;
  private isScanning = false;
  private isPlaced = false;
  private container: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async initialize(): Promise<void> {
    if (!this.container) throw new Error('Container not found');

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.container.clientWidth / this.container.clientHeight,
      0.01,
      20
    );

    // Renderer with WebXR
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true // Important for capturing screenshots
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.xr.enabled = true;
    this.container.appendChild(this.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 5, 5);
    this.scene.add(directionalLight);

    // Create reticle
    const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00, 
      side: THREE.DoubleSide 
    });
    this.reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    this.reticle.matrixAutoUpdate = false;
    this.reticle.visible = false;
    this.scene.add(this.reticle);
  }

  async startARSession(): Promise<void> {
    if (!this.renderer) throw new Error('Renderer not initialized');

    const sessionInit = {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['dom-overlay'],
    };

    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar', sessionInit);
      await this.renderer.xr.setSession(session);
      this.isScanning = true;

      // Setup controller for tap events
      const controller = this.renderer.xr.getController(0);
      controller.addEventListener('select', this.onSelect.bind(this));
      this.scene?.add(controller);

      // Start animation loop
      this.renderer.setAnimationLoop(this.render.bind(this));
    } catch (error) {
      console.error('Failed to start AR session:', error);
      throw error;
    }
  }

  private render(timestamp: number, frame?: XRFrame): void {
    if (!frame || !this.renderer || !this.scene || !this.camera) return;

    const referenceSpace = this.renderer.xr.getReferenceSpace();
    const session = this.renderer.xr.getSession();

    // Request hit test source
    if (!this.hitTestSourceRequested && referenceSpace && session) {
      session.requestReferenceSpace('viewer').then((viewerSpace) => {
        session.requestHitTestSource?.({ space: viewerSpace })?.then((source) => {
          this.hitTestSource = source;
        });
      });
      this.hitTestSourceRequested = true;
    }

    // Perform hit test
    if (this.hitTestSource && frame && this.reticle) {
      const hitTestResults = frame.getHitTestResults(this.hitTestSource);
      
      if (hitTestResults.length > 0 && !this.isPlaced) {
        const hit = hitTestResults[0];
        const pose = hit.getPose(referenceSpace!);
        
        if (pose) {
          this.reticle.visible = true;
          this.reticle.matrix.fromArray(pose.transform.matrix);
        }
      } else if (!this.isPlaced) {
        this.reticle.visible = false;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onSelect(): void {
    if (!this.reticle || !this.reticle.visible || this.isPlaced) return;

    if (this.model) {
      // Place the model
      this.model.position.setFromMatrixPosition(this.reticle.matrix);
      this.model.visible = true;
      this.isPlaced = true;
      this.reticle.visible = false;
    }
  }

  async loadModel(modelUrl: string): Promise<void> {
    if (!this.scene) throw new Error('Scene not initialized');

    const loader = new GLTFLoader();
    
    return new Promise((resolve, reject) => {
      loader.load(
        modelUrl,
        (gltf) => {
          this.model = gltf.scene;
          
          // Center and scale model
          const box = new THREE.Box3().setFromObject(this.model);
          const center = box.getCenter(new THREE.Vector3());
          this.model.position.sub(center);
          
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 0.5 / maxDim;
          this.model.scale.multiplyScalar(scale);
          
          this.model.visible = false; // Hide until placed
          this.scene!.add(this.model);
          resolve();
        },
        undefined,
        reject
      );
    });
  }

  async captureThumbnail(): Promise<Blob> {
    if (!this.renderer) throw new Error('Renderer not initialized');

    return new Promise((resolve, reject) => {
      try {
        this.renderer!.domElement.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to capture thumbnail'));
          }
        }, 'image/jpeg', 0.9);
      } catch (error) {
        reject(error);
      }
    });
  }

  getModelPosition(): { x: number; y: number; z: number } | null {
    if (!this.model || !this.isPlaced) return null;
    return {
      x: this.model.position.x,
      y: this.model.position.y,
      z: this.model.position.z,
    };
  }

  isModelPlaced(): boolean {
    return this.isPlaced;
  }

  async endSession(): Promise<void> {
    const session = this.renderer?.xr.getSession();
    if (session) {
      await session.end();
    }
    this.isScanning = false;
    this.isPlaced = false;
    this.hitTestSource = null;
    this.hitTestSourceRequested = false;
  }

  dispose(): void {
    this.endSession();
    
    if (this.renderer && this.container) {
      this.renderer.setAnimationLoop(null);
      if (this.renderer.domElement.parentNode === this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.reticle = null;
    this.model = null;
  }
}
