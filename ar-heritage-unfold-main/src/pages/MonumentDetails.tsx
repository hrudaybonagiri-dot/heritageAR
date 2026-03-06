import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Calendar, User, Package, AlertTriangle, Wrench, 
  TrendingUp, ArrowLeft, Eye, History, AlertCircle 
} from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';

interface Monument {
  id: number;
  name: string;
  location: string;
  historical_era: string;
  architect?: string;
  materials?: string;
  condition_status: string;
  description: string;
  latitude?: number;
  longitude?: number;
  versions?: Array<{
    id: number;
    version_number: number;
    changes_description: string;
    created_at: string;
  }>;
  environmental_risks?: Array<{
    id: number;
    risk_type: string;
    severity: string;
    description: string;
    recorded_date: string;
  }>;
  restoration_records?: Array<{
    id: number;
    restoration_date: string;
    work_performed: string;
    cost: number;
    contractor: string;
  }>;
}

const MonumentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [monument, setMonument] = useState<Monument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonument();
  }, [id]);

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

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500',
    };
    return colors[severity] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading monument details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !monument) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/explore">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Explore
              </Link>
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{monument.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5" />
                  <span>{monument.location}</span>
                </div>
                <Badge className={getConditionColor(monument.condition_status)}>
                  {monument.condition_status}
                </Badge>
              </div>
              
              <Button asChild size="lg">
                <Link to={`/ar-viewer/${monument.id}`}>
                  <Eye className="mr-2 h-5 w-5" />
                  View in AR
                </Link>
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {monument.description}
                  </p>
                </CardContent>
              </Card>

              <Tabs defaultValue="versions" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="versions">
                    <History className="mr-2 h-4 w-4" />
                    Versions
                  </TabsTrigger>
                  <TabsTrigger value="risks">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Risks
                  </TabsTrigger>
                  <TabsTrigger value="restorations">
                    <Wrench className="mr-2 h-4 w-4" />
                    Restorations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="versions" className="space-y-4">
                  {monument.versions && monument.versions.length > 0 ? (
                    monument.versions.map((version) => (
                      <Card key={version.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">Version {version.version_number}</CardTitle>
                          <CardDescription>
                            {new Date(version.created_at).toLocaleDateString()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{version.changes_description}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        No version history available
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="risks" className="space-y-4">
                  {monument.environmental_risks && monument.environmental_risks.length > 0 ? (
                    monument.environmental_risks.map((risk) => (
                      <Card key={risk.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{risk.risk_type}</CardTitle>
                              <CardDescription>
                                Recorded: {new Date(risk.recorded_date).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            <Badge className={getSeverityColor(risk.severity)}>
                              {risk.severity}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{risk.description}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        No environmental risks recorded
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="restorations" className="space-y-4">
                  {monument.restoration_records && monument.restoration_records.length > 0 ? (
                    monument.restoration_records.map((restoration) => (
                      <Card key={restoration.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {new Date(restoration.restoration_date).toLocaleDateString()}
                          </CardTitle>
                          <CardDescription>{restoration.contractor}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm">{restoration.work_performed}</p>
                          {restoration.cost && (
                            <p className="text-sm font-semibold text-primary">
                              Cost: ${restoration.cost.toLocaleString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        No restoration records available
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Info Cards */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {monument.historical_era && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Historical Era</p>
                        <p className="text-sm text-muted-foreground">{monument.historical_era}</p>
                      </div>
                    </div>
                  )}

                  {monument.architect && (
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Architect</p>
                        <p className="text-sm text-muted-foreground">{monument.architect}</p>
                      </div>
                    </div>
                  )}

                  {monument.materials && (
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Materials</p>
                        <p className="text-sm text-muted-foreground">{monument.materials}</p>
                      </div>
                    </div>
                  )}

                  {monument.latitude && monument.longitude && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Coordinates</p>
                        <p className="text-sm text-muted-foreground">
                          {monument.latitude.toFixed(4)}, {monument.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Versions</span>
                    <span className="font-semibold">{monument.versions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Risks</span>
                    <span className="font-semibold">{monument.environmental_risks?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Restorations</span>
                    <span className="font-semibold">{monument.restoration_records?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MonumentDetails;
