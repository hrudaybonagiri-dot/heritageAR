// WebXR Type Declarations

interface XRHitTestSource {
  cancel(): void;
}

interface XRHitTestResult {
  getPose(baseSpace: XRReferenceSpace): XRPose | undefined;
}

interface XRFrame {
  getHitTestResults(hitTestSource: XRHitTestSource): XRHitTestResult[];
  getPose(space: XRSpace, baseSpace: XRReferenceSpace): XRPose | undefined;
}

interface XRSession {
  requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace>;
  requestHitTestSource?(options: XRHitTestOptionsInit): Promise<XRHitTestSource>;
  end(): Promise<void>;
}

interface XRReferenceSpace extends XRSpace {
  getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
}

interface XRSpace {}

interface XRPose {
  transform: XRRigidTransform;
  emulatedPosition: boolean;
}

interface XRRigidTransform {
  position: DOMPointReadOnly;
  orientation: DOMPointReadOnly;
  matrix: Float32Array;
  inverse: XRRigidTransform;
}

interface XRHitTestOptionsInit {
  space: XRSpace;
  offsetRay?: XRRay;
}

interface XRRay {
  origin: DOMPointReadOnly;
  direction: DOMPointReadOnly;
  matrix: Float32Array;
}

type XRReferenceSpaceType = 'viewer' | 'local' | 'local-floor' | 'bounded-floor' | 'unbounded';

interface Navigator {
  xr?: {
    isSessionSupported(mode: XRSessionMode): Promise<boolean>;
    requestSession(mode: XRSessionMode, options?: XRSessionInit): Promise<XRSession>;
  };
}

type XRSessionMode = 'inline' | 'immersive-vr' | 'immersive-ar';

interface XRSessionInit {
  requiredFeatures?: string[];
  optionalFeatures?: string[];
  domOverlay?: {
    root: Element;
  };
}

declare module 'three' {
  interface WebGLRenderer {
    xr: {
      enabled: boolean;
      isPresenting: boolean;
      getSession(): XRSession | null;
      setSession(session: XRSession | null): Promise<void>;
      getReferenceSpace(): XRReferenceSpace | null;
      setReferenceSpace(space: XRReferenceSpace): void;
      getController(index: number): Group;
      getControllerGrip(index: number): Group;
      addEventListener(type: string, listener: (event: any) => void): void;
      removeEventListener(type: string, listener: (event: any) => void): void;
    };
    setAnimationLoop(callback: ((time: number, frame?: XRFrame) => void) | null): void;
  }
}
