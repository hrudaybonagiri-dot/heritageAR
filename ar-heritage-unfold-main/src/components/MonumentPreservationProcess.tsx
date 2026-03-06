import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Camera, Scan3D, Database, Shield, CheckCircle2, 
  ArrowRight, Eye, Wrench, AlertTriangle, TrendingUp 
} from "lucide-react";

const preservationSteps = [
  {
    step: 1,
    title: "Initial Assessment",
    icon: Eye,
    description: "Comprehensive evaluation of the monument's current condition, structural integrity, and historical significance.",
    details: [
      "Visual inspection by heritage experts",
      "Structural analysis and stability assessment",
      "Documentation of existing damage and deterioration",
      "Historical research and archival review",
      "Environmental impact assessment"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    step: 2,
    title: "3D Scanning & Documentation",
    icon: Scan3D,
    description: "High-resolution 3D scanning to create accurate digital twins of the monument for preservation and analysis.",
    details: [
      "LiDAR scanning for precise measurements",
      "Photogrammetry for texture capture",
      "Drone surveys for aerial documentation",
      "Ground-penetrating radar for subsurface analysis",
      "Thermal imaging for moisture detection"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    step: 3,
    title: "Digital Archiving",
    icon: Database,
    description: "Secure storage and cataloging of all collected data in a comprehensive digital preservation system.",
    details: [
      "Cloud-based storage with redundancy",
      "Metadata tagging and categorization",
      "Version control for tracking changes",
      "Integration with global heritage databases",
      "Long-term data preservation protocols"
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    step: 4,
    title: "Risk Analysis",
    icon: AlertTriangle,
    description: "Identification and assessment of environmental, structural, and human-made threats to the monument.",
    details: [
      "Climate change impact assessment",
      "Pollution and weathering analysis",
      "Seismic risk evaluation",
      "Tourism impact studies",
      "Conflict and vandalism risk assessment"
    ],
    color: "from-orange-500 to-red-500"
  },
  {
    step: 5,
    title: "Conservation Planning",
    icon: Wrench,
    description: "Development of comprehensive restoration and maintenance strategies based on collected data.",
    details: [
      "Material analysis and selection",
      "Restoration technique planning",
      "Budget and timeline estimation",
      "Stakeholder consultation",
      "Regulatory compliance review"
    ],
    color: "from-amber-500 to-yellow-500"
  },
  {
    step: 6,
    title: "Ongoing Monitoring",
    icon: TrendingUp,
    description: "Continuous monitoring and maintenance to ensure long-term preservation of the monument.",
    details: [
      "Regular condition assessments",
      "Environmental monitoring systems",
      "Structural health monitoring",
      "Periodic 3D re-scanning",
      "Public engagement and education"
    ],
    color: "from-indigo-500 to-blue-500"
  }
];

const MonumentPreservationProcess = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  return (
    <section className="section-padding bg-muted/30">
      <div ref={ref} className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            Professional Process
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3 mb-6">
            Monument Preservation <span className="text-gradient-gold">Workflow</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Our comprehensive 6-step process ensures monuments are preserved with the highest professional standards, 
            combining cutting-edge technology with traditional conservation expertise.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {preservationSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
            >
              <Card 
                className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/50"
                onClick={() => setSelectedStep(step.step)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge variant="outline" className="text-lg font-bold">
                      Step {step.step}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">{step.title}</CardTitle>
                  <CardDescription className="text-sm mt-2">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStep(step.step);
                    }}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Process Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="glass-card p-8"
        >
          <h3 className="text-2xl font-serif font-bold mb-6 text-center">
            Complete Preservation Lifecycle
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {preservationSteps.map((step, i) => (
              <div key={step.step} className="flex items-center">
                <div 
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r ${step.color} text-white cursor-pointer hover:scale-105 transition-transform`}
                  onClick={() => setSelectedStep(step.step)}
                >
                  <step.icon className="w-5 h-5" />
                  <span className="font-semibold text-sm">{step.title}</span>
                </div>
                {i < preservationSteps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Detail Modal */}
        <Dialog open={selectedStep !== null} onOpenChange={() => setSelectedStep(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedStep && preservationSteps[selectedStep - 1] && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${preservationSteps[selectedStep - 1].color} flex items-center justify-center`}>
                      {(() => {
                        const Icon = preservationSteps[selectedStep - 1].icon;
                        return <Icon className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        Step {selectedStep} of {preservationSteps.length}
                      </Badge>
                      <DialogTitle className="text-2xl font-serif">
                        {preservationSteps[selectedStep - 1].title}
                      </DialogTitle>
                    </div>
                  </div>
                  <DialogDescription className="text-base">
                    {preservationSteps[selectedStep - 1].description}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6">
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Key Activities
                  </h4>
                  <ul className="space-y-3">
                    {preservationSteps[selectedStep - 1].details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{i + 1}</span>
                        </div>
                        <span className="text-sm">{detail}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    <Shield className="inline w-4 h-4 mr-2 text-primary" />
                    All preservation activities follow UNESCO World Heritage guidelines and international conservation standards.
                  </p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default MonumentPreservationProcess;