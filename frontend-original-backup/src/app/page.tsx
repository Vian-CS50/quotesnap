import Navbar from "@/components/Navbar";
import VideoFab from "@/components/VideoFab";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import Stats from "@/components/sections/Stats";
import HowItWorks from "@/components/sections/HowItWorks";
import InteractiveDemo from "@/components/sections/InteractiveDemo";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{ backgroundColor: "#0B0F19" }}>
      <Navbar />
      <Hero />
      <VideoFab />
      <TrustBar />
      <Stats />
      <HowItWorks />
      <InteractiveDemo />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
