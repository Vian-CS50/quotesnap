"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

function getPasswordStrength(password: string): { strength: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-error", "bg-utility-gold", "bg-growth-green/70", "bg-growth-green"];
  return {
    strength: score,
    label: labels[Math.max(0, score - 1)] || "Weak",
    color: colors[Math.max(0, score - 1)] || "bg-error",
  };
}

export default function SignupPage() {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the terms.");
      return;
    }

    try {
      await signup({ email, password, name, businessName });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col items-center justify-center px-margin-mobile py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/quotesnap-logo-icon-96.png"
            alt="QuoteSnap"
            width={64}
            height={64}
            className="rounded-xl"
            priority
          />
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Create your account</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Start generating professional quotes in minutes</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="font-body-sm text-body-sm font-semibold text-on-surface">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="w-full h-12 px-4 rounded-lg border border-surface-subtle bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-growth-green/30 focus:border-growth-green transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="font-body-sm text-body-sm font-semibold text-on-surface">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              className="w-full h-12 px-4 rounded-lg border border-surface-subtle bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-growth-green/30 focus:border-growth-green transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="businessName" className="font-body-sm text-body-sm font-semibold text-on-surface">
              Business Name
            </label>
            <input
              id="businessName"
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Evergreen Landscapes"
              className="w-full h-12 px-4 rounded-lg border border-surface-subtle bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-growth-green/30 focus:border-growth-green transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="font-body-sm text-body-sm font-semibold text-on-surface">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-lg border border-surface-subtle bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-growth-green/30 focus:border-growth-green transition-all"
            />
            {/* Password strength */}
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${i <= passwordStrength.strength ? passwordStrength.color : "bg-surface-container-high"}`}
                    />
                  ))}
                </div>
                <p className="font-label-mono text-label-mono text-on-surface-variant">
                  {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="font-body-sm text-body-sm font-semibold text-on-surface">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-lg border border-surface-subtle bg-surface-container-lowest text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-growth-green/30 focus:border-growth-green transition-all"
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-surface-subtle text-growth-green focus:ring-growth-green"
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              I agree to the{" "}
              <Link href="#" className="text-growth-green font-semibold hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-growth-green font-semibold hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-growth-green text-on-primary font-button-text text-button-text rounded-lg hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <MaterialIcon name="person_add" size={20} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Error Toast */}
        {error && (
          <div className="bg-error-container border border-error text-on-error-container p-4 rounded-lg flex items-center gap-3 animate-error-shake">
            <MaterialIcon name="error" className="text-error" size={20} />
            <p className="font-body-sm text-body-sm">{error}</p>
          </div>
        )}

        {/* Login link */}
        <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
          Already have an account?{" "}
          <Link href="/login" className="text-growth-green font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
