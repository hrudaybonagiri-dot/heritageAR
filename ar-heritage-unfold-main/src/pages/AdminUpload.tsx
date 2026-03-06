import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminUpload = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    historical_era: '',
    architect: '',
    materials: '',
    condition_status: 'good',
    description: '',
    model_format: 'GLTF',
  });
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (type: 'model' | 'thumbnail', file: File | null) => {
    if (type === 'model') {
      setModelFile(file);
    } else {
      setThumbnailFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location) {
      toast({
        title: 'Validation Error',
        description: 'Name and location are required fields',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const submitData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value);
      });

      // Add files
      if (modelFile) submitData.append('model', modelFile);
      if (thumbnailFile) submitData.append('thumbnail', thumbnailFile);

      // Simulate API call (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // const response = await fetch('http://localhost:5001/api/monuments', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`, // Add auth token
      //   },
      //   body: submitData,
      // });

      // if (!response.ok) throw new Error('Upload failed');

      toast({
        title: 'Success!',
        description: 'Monument uploaded successfully',
      });

      // Reset form
      setFormData({
        name: '',
        location: '',
        latitude: '',
        longitude: '',
        historical_era: '',
        architect: '',
        materials: '',
        condition_status: 'good',
        description: '',
        model_format: 'GLTF',
      });
      setModelFile(null);
      setThumbnailFile(null);
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/explore">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Explore
              </Link>
            </Button>
            <h1 className="text-4xl font-bold mb-2">Upload Monument</h1>
            <p className="text-muted-foreground">
              Add a new historical monument with 3D model and details
            </p>
          </div>

          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle>Monument Information</CardTitle>
              <CardDescription>
                Fill in the details and upload 3D model files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Monument Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Colosseum"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Rome, Italy"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 41.8902"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="e.g., 12.4922"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Historical Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Historical Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="era">Historical Era</Label>
                      <Input
                        id="era"
                        placeholder="e.g., Ancient Rome"
                        value={formData.historical_era}
                        onChange={(e) => handleInputChange('historical_era', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="architect">Architect</Label>
                      <Input
                        id="architect"
                        placeholder="e.g., Vespasian"
                        value={formData.architect}
                        onChange={(e) => handleInputChange('architect', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="materials">Materials</Label>
                    <Input
                      id="materials"
                      placeholder="e.g., Concrete, stone, brick"
                      value={formData.materials}
                      onChange={(e) => handleInputChange('materials', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition Status</Label>
                    <Select
                      value={formData.condition_status}
                      onValueChange={(value) => handleInputChange('condition_status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description of the monument..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>
                </div>

                {/* File Uploads */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">3D Model & Images</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model_format">Model Format</Label>
                    <Select
                      value={formData.model_format}
                      onValueChange={(value) => handleInputChange('model_format', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GLTF">GLTF (.gltf, .glb)</SelectItem>
                        <SelectItem value="OBJ">OBJ (.obj)</SelectItem>
                        <SelectItem value="FBX">FBX (.fbx)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">3D Model File</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <Input
                        id="model"
                        type="file"
                        accept=".gltf,.glb,.obj,.fbx"
                        onChange={(e) => handleFileChange('model', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="model" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                          {modelFile ? modelFile.name : 'Click to upload 3D model'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          GLTF, OBJ, or FBX (Max 100MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('thumbnail', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="thumbnail" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                          {thumbnailFile ? thumbnailFile.name : 'Click to upload thumbnail'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, PNG, or WebP (Max 10MB)
                        </p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={uploading} className="flex-1">
                    {uploading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Upload Monument
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/explore">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 bg-muted/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5" />
                Upload Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Ensure 3D models are optimized for web viewing (recommended: under 50MB)</p>
              <p>• Use high-quality textures but keep file sizes reasonable</p>
              <p>• GLTF format is recommended for best compatibility</p>
              <p>• Include accurate GPS coordinates for map integration</p>
              <p>• Provide detailed descriptions for educational purposes</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminUpload;
