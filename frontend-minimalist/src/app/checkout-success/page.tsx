"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Check, FileText, Zap, Users, Clock } from "lucide-react";

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#C2410C", "#FB923C", "#1C1917", "#78716C", "#9A3412"];
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }[] = [];

    const cx = canvas.width / 2;
    const cy = canvas.height / 3;
    for (let i = 0; i < 120; i++) {
      const angle = (Math.PI * 2 * i) / 120 + (Math.random() - 0.5) * 0.5;
      const speed = 3 + Math.random() * 6;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        opacity: 1,
      });
    }

    let animId: number;
    const gravity = 0.12;
    const drag = 0.98;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;
      for (const p of particles) {
        if (p.opacity <= 0) continue;
        alive++;
        p.vx *= drag;
        p.vy *= drag;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.004;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      if (alive > 0) {
        animId = requestAnimationFrame(animate);
      }
    }

    animId = requestAnimationFrame(animate);

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
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

export default function CheckoutSuccess() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden">
      <ConfettiCanvas />

      <div
        className={`relative z-10 max-w-md w-full text-center transition-all duration-700 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Animated checkmark */}
        <div className="relative mx-auto mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#FFF5F0] border border-[#FDBA74] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#C2410C]"
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
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: 30,
                }}
              />
            </svg>
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border border-[#FDBA74] animate-ping" style={{ animationDuration: "2s" }} />
        </div>

        {/* Heading */}
        <h1 
          className="text-3xl font-bold text-[#1C1917] mb-3"
          
        >
          Welcome to QuoteSnap Pro
        </h1>
        <p className="text-[#A8A29E] mb-8 leading-relaxed">
          Your subscription is active. You now have unlimited access to
          AI-powered quotes that win more jobs.
        </p>

        {/* Value props */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: FileText, label: "Unlimited quotes" },
            { icon: Zap, label: "AI in 30 seconds" },
            { icon: Users, label: "Follow-up templates" },
            { icon: Clock, label: "7-day free trial" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 bg-[#F5F4F0] border border-[#D6D3D1] rounded-sm px-4 py-3"
            >
              <Icon className="w-4 h-4 text-[#C2410C] shrink-0" />
              <span className="text-sm text-[#1C1917]">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center justify-center w-full h-12 rounded-sm bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold transition-colors"
        >
          Start Quoting
        </Link>

        <p className="mt-4 text-xs text-[#A8A29E]">
          Questions? Reply to your welcome email — we read every one.
        </p>
      </div>

      <style jsx global>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </main>
  );
}
