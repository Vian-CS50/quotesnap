"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
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
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Welcome back</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Sign in to your QuoteSnap account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-surface-subtle text-growth-green focus:ring-growth-green"
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant">Remember me</span>
            </label>
            <Link href="/forgot-password" className="font-body-sm text-body-sm text-growth-green hover:underline font-semibold">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-growth-green text-on-primary font-button-text text-button-text rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <MaterialIcon name="login" size={20} />
                Sign In
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

        {/* Sign up link */}
        <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-growth-green font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
