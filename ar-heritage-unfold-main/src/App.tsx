import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Gallery from "./pages/Gallery";
import Impact from "./pages/Impact";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import ExploreHeritage from "./pages/ExploreHeritage";
import ARViewer from "./pages/ARViewer";
import AdminUpload from "./pages/AdminUpload";
import MonumentDetails from "./pages/MonumentDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/explore" element={<ExploreHeritage />} />
          <Route path="/ar-viewer/:id" element={<ARViewer />} />
          <Route path="/monument/:id" element={<MonumentDetails />} />
          <Route path="/admin/upload" element={<AdminUpload />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
