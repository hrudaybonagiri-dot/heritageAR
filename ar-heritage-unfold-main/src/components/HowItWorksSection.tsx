import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ScanLine, Eye, BookOpen } from "lucide-react";

const steps = [
  { icon: ScanLine, step: "01", title: "Scan the Monument", desc: "Point your device at any heritage site to begin the AR experience." },
  { icon: Eye, step: "02", title: "View AR Reconstruction", desc: "Watch as the monument is digitally restored to its original glory in real-time." },
  { icon: BookOpen, step: "03", title: "Learn Interactively", desc: "Explore historical stories, timelines, and cultural context through immersive narration." },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="section-padding relative">
      <div ref={ref} className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">How It Works</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3">
            Three Simple <span className="text-gradient-gold">Steps</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 * i }}
              className="text-center relative"
            >
              <div className="relative mx-auto w-20 h-20 rounded-2xl gradient-gold flex items-center justify-center mb-6 glow-gold">
                <s.icon className="w-9 h-9 text-primary-foreground" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-primary text-primary text-xs font-bold flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
