"use client";

import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { Shield, LogIn } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 p-8 text-center"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderRadius: "0px" }}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4" style={{ backgroundColor: "var(--primary)" }}>
          <Shield className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-serif text-xl mb-2" style={{ color: "var(--foreground)" }}>
          Sign in to draft quotes
        </h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Create a free account to get 3 AI-drafted quotes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 font-mono text-xs uppercase tracking-wider transition-colors"
            style={{ backgroundColor: "var(--primary)", color: "white", borderRadius: "0px" }}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </a>
          <a
            href="/signup"
            className="inline-flex items-center justify-center h-12 px-6 border font-mono text-xs uppercase tracking-wider transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}
          >
            Create Free Account
          </a>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}
