"use client";

import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CheckoutCancel() {
  return (
    <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-slate-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-slate-500/10 border border-slate-500/20 flex items-center justify-center mb-8">
          <XCircle className="w-10 h-10 text-slate-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">
          Checkout Cancelled
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          No worries — you weren&apos;t charged. Come back anytime when
          you&apos;re ready to supercharge your quoting.
        </p>

        <div className="bg-[#151B2B] border border-[#1E293B] rounded-xl p-5 mb-8 text-left">
          <p className="text-sm text-slate-300 mb-2 font-medium">
            Still on the fence?
          </p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              7-day free trial — cancel anytime
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              $25.99/month — cancel anytime
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
              No lock-in, no hidden fees
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#151B2B] hover:bg-[#1E293B] border border-[#1E293B] text-white font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to QuoteSnap
        </Link>
      </div>
    </main>
  );
}
