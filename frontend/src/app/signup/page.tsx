"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    business_name: "",
    age_confirmation: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.age_confirmation) {
      setError("You must confirm you are 18+ or have guardian consent to create an account.");
      return;
    }
    setLoading(true);

    const result = await signup(form);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--background)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="border-2 p-8" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderRadius: "0px" }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4" style={{ backgroundColor: "var(--primary)" }}>
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-serif text-2xl mb-2" style={{ color: "var(--foreground)" }}>
              Create Account
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              3 free quotes. No credit card required.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 text-sm border" style={{ borderColor: "#ef4444", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                Full Name
              </label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
                className="w-full h-12 px-4 bg-transparent border text-sm outline-none focus:border-emerald-500 transition-colors"
                style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                Business Name
              </label>
              <input
                type="text"
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                className="w-full h-12 px-4 bg-transparent border text-sm outline-none focus:border-emerald-500 transition-colors"
                style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}
                placeholder="Smith Landscaping (optional)"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full h-12 px-4 bg-transparent border text-sm outline-none focus:border-emerald-500 transition-colors"
                style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}
                placeholder="you@business.com"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                  className="w-full h-12 px-4 pr-12 bg-transparent border text-sm outline-none focus:border-emerald-500 transition-colors"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}
                  placeholder="Min 8 chars, 1 letter + 1 number"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 p-3 border cursor-pointer transition-colors"
              style={{
                borderColor: form.age_confirmation ? "var(--primary)" : "var(--border)",
                backgroundColor: form.age_confirmation ? "rgba(27, 77, 62, 0.05)" : "transparent",
                borderRadius: "0px",
              }}
            >
              <input
                type="checkbox"
                checked={form.age_confirmation}
                onChange={(e) => setForm({ ...form, age_confirmation: e.target.checked })}
                className="mt-0.5 w-4 h-4 accent-emerald-600"
              />
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                I confirm I am at least 18 years old, or I have consent from a parent or guardian to use QuoteSnap and enter into subscription agreements. By creating an account, I agree to the{" "}
                <a href="/terms" target="_blank" className="underline" style={{ color: "var(--primary)" }}>Terms of Service</a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="underline" style={{ color: "var(--primary)" }}>Privacy Policy</a>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !form.age_confirmation}
              className="w-full h-12 font-mono text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: "var(--primary)", color: "white", borderRadius: "0px" }}
            >
              {loading ? "Creating account..." : "Create Free Account"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <a href="/login" className="underline" style={{ color: "var(--primary)" }}>
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
