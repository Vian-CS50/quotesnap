"use client";

import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CheckoutCancel() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="relative z-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 border border-[#D6D3D1] flex items-center justify-center mb-8">
          <XCircle className="w-10 h-10 text-[#A8A29E]" />
        </div>

        <h1 
          className="text-3xl font-bold text-[#1C1917] mb-3"
          
        >
          Checkout Cancelled
        </h1>
        <p className="text-[#A8A29E] mb-8 leading-relaxed">
          No worries — you weren&apos;t charged. Come back anytime when
          you&apos;re ready to supercharge your quoting.
        </p>

        <div className="bg-[#F5F4F0] border border-[#D6D3D1] rounded-sm p-5 mb-8 text-left">
          <p className="text-sm text-[#1C1917] mb-2 font-medium">
            Still on the fence?
          </p>
          <ul className="space-y-2 text-sm text-[#78716C]">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#C2410C]" />
              7-day free trial — cancel anytime
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#C2410C]" />
              $25.99/month — cancel anytime
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#C2410C]" />
              No lock-in, no hidden fees
            </li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full h-12 rounded-sm bg-[#1C1917] hover:bg-[#44403C] text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to QuoteSnap
        </Link>
      </div>
    </main>
  );
}
