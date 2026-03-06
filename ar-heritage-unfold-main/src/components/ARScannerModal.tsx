import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ARScanner } from '@/utils/arScanner';
import { MonumentService, CreateMonumentPayload } from '@/services/monumentService';
import { Camera, X, Check, Loader2 } from 'lucide-react';

interface ARScannerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ScanStep = 'form' | 'scanning' | 'placing' | 'capturing' | 'uploading' | 'success';

const ARScannerModal = ({ open, onClose, onSuccess }: ARScannerModalProps) => {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<ARScanner | null>(null);
  
  const [step, setStep] = useState<ScanStep>('form');
  const [isARSupported, setIsARSupported] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    historical_era: '',
  });

  useEffect(() => {
    checkARSupport();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.dispose();
      }
    };
  }, []);

  const checkARSupport = async () => {
    if ('xr' in navigator) {
      try {
        const supported = await (navigator as any).xr?.isSessionSupported('immersive-ar');
        setIsARSupported(supported || false);
      } catch (err) {
        setIsARSupported(false);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Name and description are required',
        variant: 'destructive',
      });
      return;
    }

    if (!isARSupported) {
      toast({
        title: 'AR Not Supported',
        description: 'Your device does not support AR',
        variant: 'destructive',
      });
      return;
    }

    await startARScanning();
  };

  const startARScanning = async () => {
    if (!containerRef.current) return;

    try {
      setStep('scanning');
      
      // Initialize AR Scanner
      const scanner = new ARScanner(containerRef.current);
      scannerRef.current = scanner;
      
      await scanner.initialize();
      
      // Load a sample model (in production, this could be generated or selected)
      const sampleModelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
      await scanner.loadModel(sampleModelUrl);
      
      // Start AR session
      await scanner.startARSession();
      
      setStep('placing');
      
      toast({
        title: 'AR Mode Started',
        description: 'Point at a surface and tap to place the monument',
      });

      // Wait for placement
      const checkPlacement = setInterval(() => {
        if (scanner.isModelPlaced()) {
          clearInterval(checkPlacement);
          handlePlacementComplete();
        }
      }, 500);

    } catch (error) {
      console.error('AR scanning error:', error);
      toast({
        title: 'AR Error',
        description: 'Failed to start AR scanning',
        variant: 'destructive',
      });
      setStep('form');
    }
  };

  const handlePlacementComplete = async () => {
    setStep('capturing');
    
    toast({
      title: 'Monument Placed!',
      description: 'Capturing thumbnail...',
    });

    // Wait a moment for the scene to render
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (!scannerRef.current) throw new Error('Scanner not initialized');

      // Capture thumbnail
      const thumbnailBlob = await scannerRef.current.captureThumbnail();

      // End AR session
      await scannerRef.current.endSession();

      // Upload monument
      await uploadMonument(thumbnailBlob);

    } catch (error) {
      console.error('Capture error:', error);
      toast({
        title: 'Capture Failed',
        description: 'Failed to capture thumbnail',
        variant: 'destructive',
      });
      setStep('form');
    }
  };

  const uploadMonument = async (thumbnailBlob: Blob) => {
    setStep('uploading');

    try {
      const payload: CreateMonumentPayload = {
        name: formData.name,
        description: formData.description,
        location: formData.location || 'Unknown',
        historical_era: formData.historical_era || 'Modern',
        condition_status: 'good',
        model_url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        thumbnail: thumbnailBlob,
        timestamp: new Date().toISOString(),
      };

      await MonumentService.createMonument(payload);

      setStep('success');
      
      toast({
        title: 'Success!',
        description: 'Monument preserved successfully',
      });

      // Wait a moment then close and refresh
      setTimeout(() => {
        handleClose();
        onSuccess();
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload monument',
        variant: 'destructive',
      });
      setStep('form');
    }
  };

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.dispose();
      scannerRef.current = null;
    }
    setStep('form');
    setFormData({ name: '', description: '', location: '', historical_era: '' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Preserve New Heritage Monument
          </DialogTitle>
          <DialogDescription>
            {step === 'form' && 'Fill in monument details and start AR scanning'}
            {step === 'scanning' && 'Initializing AR camera...'}
            {step === 'placing' && 'Point at a surface and tap to place monument'}
            {step === 'capturing' && 'Capturing monument data...'}
            {step === 'uploading' && 'Uploading to heritage database...'}
            {step === 'success' && 'Monument preserved successfully!'}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Monument Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Ancient Temple Ruins"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the monument's historical significance..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Athens, Greece"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="era">Historical Era</Label>
                <Input
                  id="era"
                  placeholder="e.g., Ancient Greece"
                  value={formData.historical_era}
                  onChange={(e) => setFormData({ ...formData, historical_era: e.target.value })}
                />
              </div>
            </div>

            {!isARSupported && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm text-destructive">
                  AR is not supported on this device. Please use an AR-capable mobile device.
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isARSupported}>
                <Camera className="mr-2 h-4 w-4" />
                Start AR Scanning
              </Button>
            </div>
          </form>
        )}

        {(step === 'scanning' || step === 'placing') && (
          <div className="space-y-4">
            <div 
              ref={containerRef} 
              className="w-full h-[500px] bg-black rounded-lg relative overflow-hidden"
            >
              {step === 'placing' && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg z-10 animate-pulse">
                  <p className="text-sm font-semibold">Tap screen to place monument</p>
                </div>
              )}
            </div>
            
            <Button variant="outline" onClick={handleClose} className="w-full">
              <X className="mr-2 h-4 w-4" />
              Cancel Scanning
            </Button>
          </div>
        )}

        {(step === 'capturing' || step === 'uploading') && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-semibold">
              {step === 'capturing' && 'Capturing monument data...'}
              {step === 'uploading' && 'Uploading to heritage database...'}
            </p>
            <p className="text-sm text-muted-foreground">Please wait...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="rounded-full bg-green-500 p-3">
              <Check className="h-12 w-12 text-white" />
            </div>
            <p className="text-lg font-semibold">Monument Preserved!</p>
            <p className="text-sm text-muted-foreground">
              Your heritage monument has been successfully added to the database
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ARScannerModal;
