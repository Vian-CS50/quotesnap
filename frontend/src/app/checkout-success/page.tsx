"use client";

import Link from "next/link";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, FileText, Zap, Users, Clock, Crown, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth";

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    const colors = ["#10B981", "#F59E0B", "#3B82F6", "#EC4899", "#8B5CF6"];
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      opacity: number;
    }[] = [];

    const cx = w / 2;
    const cy = h / 3;
    const count = 60;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 6;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 5,
        opacity: 1,
      });
    }

    let animId: number;
    const gravity = 0.12;
    const drag = 0.98;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);

      let alive = 0;
      for (const p of particles) {
        if (p.opacity <= 0) continue;
        alive++;
        p.vx *= drag;
        p.vy *= drag;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.008;

        const alpha = Math.max(0, p.opacity);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 4, p.size, p.size / 2);
      }

      if (alive > 0) {
        animId = requestAnimationFrame(animate);
      }
    }

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}

function SuccessContent() {
  const [showContent, setShowContent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [plan, setPlan] = useState("pro");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const urlPlan = searchParams.get("plan") || "pro";
  const { refreshUser } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // If there's no session_id at all, trust the URL plan and show success
    if (!sessionId) {
      setPlan(urlPlan);
      setVerifying(false);
      setVerified(true);
      return;
    }

    // Verify payment server-side (this also activates the subscription in demo mode)
    const verify = async () => {
      try {
        const token = localStorage.getItem("qs_access_token") || localStorage.getItem("access_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8341"}/api/verify-checkout?session_id=${sessionId}&plan=${urlPlan}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (data.verified) {
            // Use plan from server response, fallback to URL param
            const detectedPlan = data.plan || urlPlan || "pro";
            setPlan(detectedPlan);
            setVerified(true);
          } else {
            setVerified(false);
          }
        } else {
          // Auth or server error — still show success page with URL plan.
          // The webhook or fallback activation may have succeeded.
          setPlan(urlPlan);
          setVerified(true);
        }
      } catch {
        // Network error — still show success page with URL plan
        setPlan(urlPlan);
        setVerified(true);
      } finally {
        // Always refresh auth context so subscription_tier is up-to-date
        // before user navigates to pricing-model or profile
        try {
          await refreshUser();
        } catch {
          // ignore refresh errors
        }
        setVerifying(false);
      }
    };
    verify();
  }, [sessionId, urlPlan]);

  const isElite = plan === "elite";

  if (verifying) {
    return (
      <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-slate-400">Verifying your payment...</div>
      </main>
    );
  }

  if (!verified && sessionId) {
    return (
      <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-white mb-3">Payment Not Found</h1>
          <p className="text-slate-400 mb-6">We could not verify your payment. If you just completed checkout, wait a moment and refresh. If you were charged, contact us at vtradesof@gmail.com.</p>
          <Link href="/" className="inline-flex items-center justify-center w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const proProps = [
    { icon: FileText, label: "Unlimited quotes" },
    { icon: Zap, label: "AI in 30 seconds" },
    { icon: Users, label: "Follow-up templates" },
    { icon: Clock, label: "7-day free trial" },
  ];

  const eliteProps = [
    { icon: FileText, label: "Unlimited quotes" },
    { icon: Crown, label: "Custom pricing model" },
    { icon: Settings, label: "Your rates, every quote" },
    { icon: Zap, label: "AI in 30 seconds" },
  ];

  const props = isElite ? eliteProps : proProps;
  const title = isElite ? "Welcome to QuoteSnap Elite" : "Welcome to QuoteSnap Pro";
  const subtitle = isElite
    ? "Your subscription is active. Build your custom pricing model and let the AI quote with YOUR numbers."
    : "Your subscription is active. You now have unlimited access to AI-powered drafts that win more jobs.";
  const cta = isElite ? "Build Your Pricing Model" : "Start Quoting";
  const ctaHref = isElite ? "/pricing-model" : "/";
  const accentColor = isElite ? "amber" : "emerald";
  const accentClass = isElite ? "text-amber-400" : "text-emerald-400";
  const accentBg = isElite ? "bg-amber-500" : "bg-emerald-500";
  const accentBgHover = isElite ? "hover:bg-amber-600" : "hover:bg-emerald-600";
  const accentRing = isElite ? "border-amber-500/20" : "border-emerald-500/20";
  const accentBgLight = isElite ? "bg-amber-500/10" : "bg-emerald-500/10";

  return (
    <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6 relative overflow-hidden">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] ${isElite ? "bg-amber-500/10" : "bg-emerald-500/10"} rounded-full blur-[80px] pointer-events-none`} />
      <div className={`absolute bottom-0 right-0 w-[300px] h-[200px] ${isElite ? "bg-amber-500/10" : "bg-amber-500/10"} rounded-full blur-[60px] pointer-events-none`} />

      <ConfettiCanvas />

      <div
        className={`relative z-10 max-w-md w-full text-center transition-all duration-700 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="relative mx-auto mb-8">
          <div className={`w-20 h-20 mx-auto rounded-full ${accentBgLight} border ${accentRing} flex items-center justify-center`}>
            <svg
              className={`w-10 h-10 ${accentClass}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                className="animate-[draw_0.6s_ease-out_0.5s_both]"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                style={{ strokeDasharray: 30, strokeDashoffset: 30 }}
              />
            </svg>
          </div>
          <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-full border ${accentRing} animate-ping`} style={{ animationDuration: "2s" }} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">{subtitle}</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {props.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 bg-[#151B2B] border border-[#1E293B] rounded-xl px-4 py-3"
            >
              <Icon className={`w-4 h-4 ${accentClass} shrink-0`} />
              <span className="text-sm text-slate-300">{label}</span>
            </div>
          ))}
        </div>

        <Link
          href={ctaHref}
          className={`inline-flex items-center justify-center w-full h-12 rounded-xl ${accentBg} ${accentBgHover} text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]`}
        >
          {cta}
        </Link>

        {isElite && (
          <Link href="/" className="inline-flex items-center justify-center w-full h-12 mt-3 rounded-xl border border-[#1E293B] text-slate-300 hover:bg-[#151B2B] transition-all">
            Skip for now — Start Quoting
          </Link>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Questions? Reply to your welcome email — we read every one.
          {/* TODO: Change welcome email sender to support@quotesnap.com.au once domain purchased */}
        </p>
      </div>

      <style jsx global>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </main>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
