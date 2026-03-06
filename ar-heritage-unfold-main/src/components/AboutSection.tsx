import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Landmark, Eye, Scan } from "lucide-react";

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />

      <div ref={ref} className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">About HeritageAR</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3 mb-6">
            Preserving the Past,{" "}
            <span className="text-gradient-gold">Empowering the Future</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            HeritageAR leverages cutting-edge augmented reality technology to digitally preserve monuments, artifacts, and cultural traditions — ensuring they endure for generations to come.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Landmark,
              title: "Monument Preservation",
              desc: "Create detailed 3D digital twins of historical monuments, protecting their legacy against time, climate, and conflict.",
            },
            {
              icon: Eye,
              title: "Immersive Experience",
              desc: "Walk through ancient civilizations in augmented reality, witnessing history unfold around you in real-time.",
            },
            {
              icon: Scan,
              title: "Digital Archiving",
              desc: "Scan and catalog artifacts with AI-powered recognition, building the world's most comprehensive cultural database.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="glass-card p-8 hover:border-primary/30 transition-all duration-500 group"
            >
              <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
