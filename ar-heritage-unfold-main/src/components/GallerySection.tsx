import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const galleryItems = [
  { title: "Colosseum Restoration", desc: "Rome, Italy", gradient: "from-accent/40 to-secondary/30" },
  { title: "Petra Treasury", desc: "Jordan", gradient: "from-primary/40 to-accent/30" },
  { title: "Machu Picchu", desc: "Peru", gradient: "from-secondary/40 to-primary/20" },
  { title: "Angkor Wat Temples", desc: "Cambodia", gradient: "from-primary/30 to-secondary/40" },
  { title: "Great Wall Segments", desc: "China", gradient: "from-accent/30 to-primary/40" },
  { title: "Parthenon Rebuild", desc: "Athens, Greece", gradient: "from-secondary/30 to-accent/40" },
];

const GallerySection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="gallery" className="section-padding bg-muted/30">
      <div ref={ref} className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">AR Gallery</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3">
            Heritage Sites <span className="text-gradient-gold">Reimagined</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] glass-card cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} group-hover:scale-105 transition-transform duration-700`} />
              {/* AR scan lines effect */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="absolute left-0 right-0 h-px bg-primary/60"
                    style={{ top: `${20 + j * 15}%` }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 glass-card px-3 py-1 text-xs text-primary font-semibold">
                AR Ready
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
