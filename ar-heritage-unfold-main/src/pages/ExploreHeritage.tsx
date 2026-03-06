import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ARScannerModal from '@/components/ARScannerModal';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Eye, AlertCircle, Plus } from 'lucide-react';
import { API_ENDPOINTS, buildUrl } from '@/config/api';

interface Monument {
  id: number;
  name: string;
  location: string;
  historical_era: string;
  condition_status: string;
  description: string;
  thumbnail_url: string;
  latitude?: number;
  longitude?: number;
}

const ExploreHeritage = () => {
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEra, setFilterEra] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [showARScanner, setShowARScanner] = useState(false);

  useEffect(() => {
    fetchMonuments();
  }, [filterEra, filterCondition]);

  const fetchMonuments = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (filterEra !== 'all') params.era = filterEra;
      if (filterCondition !== 'all') params.condition = filterCondition;
      
      const url = buildUrl(API_ENDPOINTS.monuments.list, params);
      const response = await fetch(url);
      const data = await response.json();
      setMonuments(data.data || []);
    } catch (error) {
      console.error('Error fetching monuments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = () => {
    // Refresh monuments list after successful scan
    fetchMonuments();
  };

  const filteredMonuments = monuments.filter(monument =>
    monument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    monument.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConditionColor = (status: string) => {
    const colors: Record<string, string> = {
      excellent: 'bg-green-500',
      good: 'bg-blue-500',
      fair: 'bg-yellow-500',
      poor: 'bg-orange-500',
      critical: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Explore Heritage Monuments
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Discover detailed 3D digital twins of historical monuments from around the world
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={() => setShowARScanner(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add New Heritage
              </Button>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search monuments by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filterEra} onValueChange={setFilterEra}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by Era" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Eras</SelectItem>
                  <SelectItem value="Ancient Rome">Ancient Rome</SelectItem>
                  <SelectItem value="Ancient Egypt">Ancient Egypt</SelectItem>
                  <SelectItem value="Ancient Greece">Ancient Greece</SelectItem>
                  <SelectItem value="Medieval">Medieval</SelectItem>
                  <SelectItem value="Renaissance">Renaissance</SelectItem>
                  <SelectItem value="Mughal Empire">Mughal Empire</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCondition} onValueChange={setFilterCondition}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Monuments Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Loading monuments...</p>
              </div>
            ) : filteredMonuments.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">No monuments found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMonuments.map((monument) => (
                  <Card key={monument.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                      {monument.thumbnail_url ? (
                        <img
                          src={monument.thumbnail_url}
                          alt={monument.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <MapPin className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className={`absolute top-2 right-2 ${getConditionColor(monument.condition_status)}`}>
                        {monument.condition_status}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{monument.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {monument.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4" />
                        {monument.historical_era}
                      </div>
                      <p className="text-sm line-clamp-3">{monument.description}</p>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link to={`/ar-viewer/${monument.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View in AR
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="flex-1">
                        <Link to={`/monument/${monument.id}`}>
                          Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* AR Scanner Modal */}
      <ARScannerModal 
        open={showARScanner}
        onClose={() => setShowARScanner(false)}
        onSuccess={handleScanSuccess}
      />
    </div>
  );
};

export default ExploreHeritage;
