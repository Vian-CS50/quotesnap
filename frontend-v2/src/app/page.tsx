"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingSection } from "@/components/landing/PricingSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showDemoToast, setShowDemoToast] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (showDemoToast) {
      const timer = setTimeout(() => setShowDemoToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showDemoToast]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin w-8 h-8 border-2 border-growth-green border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <LandingNav />

      <main>
        {/* Demo Toast */}
        {showDemoToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-deep text-white px-6 py-3 rounded-lg shadow-lg font-body-md animate-slide-in">
            <div className="flex items-center gap-2">
              <MaterialIcon name="play_circle" size={20} className="text-white" />
              Demo coming soon — stay tuned!
            </div>
          </div>
        )}

        <HeroSection onDemoClick={() => setShowDemoToast(true)} />
        <StatsBar />
        <HowItWorks />
        <PricingSection />
        <FinalCTA />
      </main>

      <LandingFooter />
    </>
  );
}
