import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, Calendar, Info } from "lucide-react";

const monuments = [
  {
    id: 1,
    title: "Colosseum Restoration",
    name: "Colosseum",
    location: "Rome, Italy",
    era: "Ancient Rome",
    condition: "fair",
    description: "Ancient amphitheater in the center of Rome, built between 70-80 AD. A marvel of Roman engineering and architecture.",
    gradient: "from-amber-500/40 to-orange-600/30",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
  },
  {
    id: 2,
    title: "Taj Mahal Monument",
    name: "Taj Mahal",
    location: "Agra, India",
    era: "Mughal Empire",
    condition: "good",
    description: "Ivory-white marble mausoleum built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
    gradient: "from-blue-400/40 to-cyan-500/30",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
  },
];

const getConditionColor = (status: string) => {
  const colors: Record<string, string> = {
    excellent: "bg-green-500",
    good: "bg-blue-500",
    fair: "bg-yellow-500",
    poor: "bg-orange-500",
    critical: "bg-red-500",
  };
  return colors[status] || "bg-gray-500";
};

const CulturalHeritageSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="cultural-heritage" className="section-padding bg-background">
      <div ref={ref} className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            Cultural Heritage
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3">
            Explore Historic <span className="text-gradient-gold">Monuments</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Experience world-renowned heritage sites in augmented reality. View detailed 3D models and preservation data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {monuments.map((monument, i) => (
            <motion.div
              key={monument.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 * i }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                    style={{ backgroundImage: `url(${monument.image})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${monument.gradient} mix-blend-multiply`} />
                  
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      AR Ready
                    </Badge>
                  </div>

                  <div className="absolute top-4 left-4">
                    <Badge className={`${getConditionColor(monument.condition)} backdrop-blur-sm`}>
                      {monument.condition.charAt(0).toUpperCase() + monument.condition.slice(1)}
                    </Badge>
                  </div>

                  <div className="absolute inset-0 opacity-20 hover:opacity-40 transition-opacity duration-500">
                    {[...Array(5)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute left-0 right-0 h-px bg-primary/60"
                        style={{ top: `${20 + j * 15}%` }}
                      />
                    ))}
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl font-serif">{monument.title}</CardTitle>
                  <CardDescription className="flex flex-col gap-2 mt-2">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {monument.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {monument.era}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {monument.description}
                  </p>
                </CardContent>

                <CardFooter className="flex gap-2 pt-4 border-t">
                  <Button asChild className="flex-1">
                    <Link to={`/ar-viewer/${monument.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View in AR
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/monument/${monument.id}`}>
                      <Info className="mr-2 h-4 w-4" />
                      Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" variant="outline">
            <Link to="/explore-heritage">
              Explore All Monuments
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CulturalHeritageSection;