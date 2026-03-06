import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Box, Map, ScanLine, GraduationCap, Languages } from "lucide-react";

const features = [
  { icon: Box, title: "3D Monument Visualization", desc: "Explore photorealistic 3D reconstructions of ancient monuments from any angle and era." },
  { icon: Map, title: "Interactive AR Tours", desc: "Guide yourself through heritage sites with intelligent AR wayfinding and contextual storytelling." },
  { icon: ScanLine, title: "Artifact Scanning & Digital Archiving", desc: "Point your device at any artifact to instantly access its history, provenance, and 3D model." },
  { icon: GraduationCap, title: "Educational AR Learning Mode", desc: "Gamified learning experiences that bring history curricula to life for students of all ages." },
  { icon: Languages, title: "Multi-language Cultural Narration", desc: "Experience cultural stories narrated in 50+ languages with AI-powered contextual translation." },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="section-padding bg-muted/30 relative">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />

      <div ref={ref} className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Platform Features</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3">
            Powerful AR <span className="text-gradient-tech">Technology</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className={`glass-card p-7 group hover:border-primary/30 transition-all duration-500 ${
                i === features.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
                <f.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
