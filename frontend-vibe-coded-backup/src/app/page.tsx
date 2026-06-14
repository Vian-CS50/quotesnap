import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import VideoFab from "@/components/VideoFab";
import ErrorBoundary from "@/components/ErrorBoundary";
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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "QuoteSnap",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "25.99",
    priceCurrency: "AUD",
    priceValidUntil: "2026-12-31",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "127",
  },
  description:
    "AI quote generator for Adelaide landscapers. Turn voice memos into professional PDF quotes in 30 seconds.",
  url: "https://quotesnap.com.au",
  author: {
    "@type": "Organization",
    name: "QuoteSnap",
    url: "https://quotesnap.com.au",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <ErrorBoundary section="hero">
        <Hero />
      </ErrorBoundary>
      <VideoFab />
      <ErrorBoundary section="trust">
        <TrustBar />
      </ErrorBoundary>
      <ErrorBoundary section="stats">
        <Stats />
      </ErrorBoundary>
      <ErrorBoundary section="how it works">
        <HowItWorks />
      </ErrorBoundary>
      <ErrorBoundary section="demo">
        <InteractiveDemo />
      </ErrorBoundary>
      <ErrorBoundary section="features">
        <Features />
      </ErrorBoundary>
      <ErrorBoundary section="testimonials">
        <Testimonials />
      </ErrorBoundary>
      <ErrorBoundary section="pricing">
        <Pricing />
      </ErrorBoundary>
      <ErrorBoundary section="faq">
        <FAQ />
      </ErrorBoundary>
      <ErrorBoundary section="cta">
        <FinalCTA />
      </ErrorBoundary>
      <Footer />
    </main>
  );
}
