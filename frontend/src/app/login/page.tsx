"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, login2FA } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (requires2FA) {
      const result = await login2FA(email, password, totpCode);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      router.push("/");
      return;
    }

    const result = await login(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.requires_2fa) {
      setRequires2FA(true);
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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-serif text-2xl mb-2" style={{ color: "var(--foreground)" }}>
              {requires2FA ? "Two-Factor Authentication" : "Sign In"}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {requires2FA
                ? "Enter the 6-digit code from your authenticator app."
                : "Welcome back. Sign in to draft quotes."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 text-sm border" style={{ borderColor: "#ef4444", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!requires2FA && (
              <>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full h-12 px-4 pr-12 bg-transparent border text-sm outline-none focus:border-emerald-500 transition-colors"
                      style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}
                      placeholder="••••••••"
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
              </>
            )}

            {requires2FA && (
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                  6-Digit Code
                </label>
                <input
                  type="text"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  maxLength={6}
                  inputMode="numeric"
                  autoFocus
                  className="w-full h-12 px-4 bg-transparent border text-sm outline-none focus:border-emerald-500 transition-colors text-center tracking-[0.5em] font-mono text-lg"
                  style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}
                  placeholder="000000"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 font-mono text-xs uppercase tracking-wider disabled:opacity-50 transition-colors"
              style={{ backgroundColor: "var(--primary)", color: "white", borderRadius: "0px" }}
            >
              {loading ? "Please wait..." : requires2FA ? "Verify Code" : "Sign In"}
            </button>
          </form>

          {!requires2FA && (
            <p className="text-center text-sm mt-6" style={{ color: "var(--text-secondary)" }}>
              No account?{" "}
              <a href="/signup" className="underline" style={{ color: "var(--primary)" }}>
                Sign up free
              </a>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
