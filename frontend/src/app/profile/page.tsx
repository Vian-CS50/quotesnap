"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Building2,
  Crown,
  Zap,
  ArrowLeft,
  Loader2,
  Quote,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8341";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [mounted, loading, user, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    );
  }

  if (!user) return null;

  const handleCancel = async () => {
    if (!confirm("Cancel your subscription? You'll be downgraded to the Free plan immediately.")) return;
    setCancelling(true);
    try {
      const token = localStorage.getItem("qs_access_token") || localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/cancel-subscription`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      await refreshUser();
    } catch (err: any) {
      alert(err.message || "Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  const tier = user.subscription_tier || "free";
  const isPro = tier === "pro";
  const isElite = tier === "elite";
  const isPaid = isPro || isElite;

  const tierConfig: Record<
    string,
    { label: string; icon: React.ReactNode; color: string; bg: string; desc: string }
  > = {
    free: {
      label: "Free",
      icon: <Zap className="w-5 h-5" />,
      color: "var(--text-muted)",
      bg: "var(--surface)",
      desc: "3 quotes total. Upgrade to unlock unlimited quotes and premium features.",
    },
    pro: {
      label: "Pro",
      icon: <Zap className="w-5 h-5" />,
      color: "var(--primary)",
      bg: "var(--primary)",
      desc: "Unlimited quotes, follow-ups, voice memos, and GST calculations.",
    },
    elite: {
      label: "Elite",
      icon: <Crown className="w-5 h-5" />,
      color: "var(--accent)",
      bg: "var(--accent)",
      desc: "Everything in Pro plus custom pricing models, labour rates, and job templates.",
    },
  };

  const current = tierConfig[tier] || tierConfig.free;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider mb-8 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-serif text-3xl md:text-4xl mb-8" style={{ color: "var(--foreground)", lineHeight: 1.1 }}>
            Your Profile
          </h1>

          {/* Plan Badge Card */}
          <div
            className="border-2 p-6 md:p-8 mb-6"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: current.color,
              borderRadius: "0px",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 flex items-center justify-center"
                  style={{ backgroundColor: current.color, color: "var(--background)" }}
                >
                  {current.icon}
                </div>
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Current Plan
                  </p>
                  <p className="text-xl font-bold" style={{ color: current.color }}>
                    {current.label}
                  </p>
                </div>
              </div>
              <div
                className="px-3 py-1 text-xs font-mono uppercase tracking-wider"
                style={{
                  backgroundColor: isPaid ? "var(--primary)" : "var(--surface)",
                  color: isPaid ? "white" : "var(--text-muted)",
                  border: isPaid ? "none" : "1px solid var(--border)",
                }}
              >
                {isPaid ? "Active" : "Free"}
              </div>
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {current.desc}
            </p>
          </div>

          {/* Account Details */}
          <div
            className="border p-6 md:p-8 mb-6"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              borderRadius: "0px",
            }}
          >
            <h2 className="font-mono text-xs uppercase tracking-wider mb-6" style={{ color: "var(--text-muted)" }}>
              Account Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Name
                  </p>
                  <p className="text-sm" style={{ color: "var(--foreground)" }}>
                    {user.full_name || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Email
                  </p>
                  <p className="text-sm" style={{ color: "var(--foreground)" }}>
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Building2 className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Business
                  </p>
                  <p className="text-sm" style={{ color: "var(--foreground)" }}>
                    {user.business_name || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div
            className="border p-6 md:p-8 mb-6"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              borderRadius: "0px",
            }}
          >
            <h2 className="font-mono text-xs uppercase tracking-wider mb-6" style={{ color: "var(--text-muted)" }}>
              Usage
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Quotes Used
                </p>
                <p className="text-2xl font-serif mt-1" style={{ color: "var(--foreground)" }}>
                  {user.quotes_used || 0}
                </p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Quotes Remaining
                </p>
                <p className="text-2xl font-serif mt-1" style={{ color: "var(--foreground)" }}>
                  {isPaid ? "Unlimited" : user.quotes_remaining || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div
            className="border p-6 md:p-8 mb-8"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              borderRadius: "0px",
            }}
          >
            <h2 className="font-mono text-xs uppercase tracking-wider mb-6" style={{ color: "var(--text-muted)" }}>
              Your Features
            </h2>

            <div className="space-y-3">
              {[
                { label: "Unlimited AI Quotes", available: isPaid },
                { label: "Voice Memo to PDF", available: true },
                { label: "Follow-up Reminders", available: isPaid },
                { label: "Quote Win/Loss Tracking", available: isPaid },
                { label: "GST Calculations", available: isPaid },
                { label: "Custom Pricing Model", available: isElite },
                { label: "Labour Rate Rules", available: isElite },
                { label: "Job-Type Templates", available: isElite },
              ].map((feat) => (
                <div key={feat.label} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {feat.label}
                  </span>
                  {feat.available ? (
                    <CheckCircle2 className="w-4 h-4" style={{ color: "var(--primary)" }} />
                  ) : (
                    <XCircle className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isPaid && (
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 font-mono text-xs uppercase tracking-wider transition-colors"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "white",
                  borderRadius: "0px",
                }}
              >
                <Zap className="w-4 h-4" />
                Upgrade to Pro
              </Link>
            )}
            {isPro && (
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 font-mono text-xs uppercase tracking-wider transition-colors"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--background)",
                  borderRadius: "0px",
                }}
              >
                <Crown className="w-4 h-4" />
                Upgrade to Elite
              </Link>
            )}
            {isElite && (
              <Link
                href="/pricing-model"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 border font-mono text-xs uppercase tracking-wider transition-colors"
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                  borderRadius: "0px",
                }}
              >
                <Crown className="w-4 h-4" />
                Edit Pricing Model
              </Link>
            )}
            {isPaid && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 border font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                style={{
                  borderColor: "var(--danger)",
                  color: "var(--danger)",
                  borderRadius: "0px",
                }}
              >
                {cancelling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Cancel Plan
              </button>
            )}
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 border font-mono text-xs uppercase tracking-wider transition-colors"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
                borderRadius: "0px",
              }}
            >
              <Quote className="w-4 h-4" />
              Generate Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
