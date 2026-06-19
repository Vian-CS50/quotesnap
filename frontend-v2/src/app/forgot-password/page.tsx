"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link. Please try again.");
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
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Reset your password</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Enter your email and we&apos;ll send you a link to reset your password
          </p>
        </div>

        {sent ? (
          <div className="bg-primary-fixed border border-growth-green/20 p-6 rounded-lg space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-growth-green rounded-full flex items-center justify-center">
                <MaterialIcon name="check" className="text-white" size={20} />
              </div>
              <div>
                <p className="font-body-md font-semibold text-on-surface">Check your inbox</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  We&apos;ve sent a password reset link to {email}
                </p>
              </div>
            </div>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-growth-green text-on-primary font-button-text text-button-text rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <MaterialIcon name="send" size={20} />
                  Send Reset Link
                </>
              )}
            </button>
          </form>
        )}

        {/* Error Toast */}
        {error && (
          <div className="bg-error-container border border-error text-on-error-container p-4 rounded-lg flex items-center gap-3 animate-error-shake">
            <MaterialIcon name="error" className="text-error" size={20} />
            <p className="font-body-sm text-body-sm">{error}</p>
          </div>
        )}

        {/* Back to login */}
        <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
          <Link href="/login" className="text-growth-green font-semibold hover:underline inline-flex items-center gap-1">
            <MaterialIcon name="arrow_back" size={16} />
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
