import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import MonumentPreservationProcess from "@/components/MonumentPreservationProcess";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AboutSection />
      <MonumentPreservationProcess />
      <Footer />
    </div>
  );
};

export default About;