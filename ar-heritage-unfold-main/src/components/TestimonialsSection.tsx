import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Elena Vasquez",
    role: "Director, UNESCO Heritage Division",
    quote: "HeritageAR has revolutionized how we approach monument preservation. The 3D digital twins are indistinguishable from reality.",
  },
  {
    name: "Prof. Raj Patel",
    role: "Head of Archaeology, Oxford University",
    quote: "Our students' engagement with ancient history increased dramatically since integrating HeritageAR into our curriculum.",
  },
  {
    name: "Sofia Müller",
    role: "Tourism Minister, Bavaria",
    quote: "Since deploying HeritageAR at our heritage sites, visitor satisfaction scores have reached an all-time high.",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-muted/30">
      <div ref={ref} className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Testimonials</span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mt-3">
            Trusted by <span className="text-gradient-gold">Leaders</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className="glass-card p-8 hover:border-primary/30 transition-all duration-500"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div>
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
