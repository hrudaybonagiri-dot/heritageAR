import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, GraduationCap, Plane, Database } from "lucide-react";

const impacts = [
  { icon: Shield, title: "Cultural Preservation", value: "500+", label: "Monuments Digitized", desc: "Safeguarding irreplaceable cultural landmarks through precise digital preservation." },
  { icon: GraduationCap, title: "Education", value: "2M+", label: "Students Reached", desc: "Making history tangible for learners worldwide through immersive AR curricula." },
  { icon: Plane, title: "Tourism Enhancement", value: "40%", label: "Visitor Engagement Increase", desc: "Enriching tourist experiences with deep contextual storytelling at heritage sites." },
  { icon: Database, title: "Digital Archiving", value: "10K+", label: "Artifacts Cataloged", desc: "Building the world's most comprehensive open-access cultural heritage database." },
];

const ImpactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="impact" className="section-padding relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

      <div ref={ref} className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Our Impact</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3">
            Making a <span className="text-gradient-warm">Difference</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impacts.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="glass-card p-7 text-center group hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-3xl font-bold text-gradient-gold mb-1">{item.value}</div>
              <div className="text-sm font-semibold text-foreground mb-2">{item.label}</div>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
