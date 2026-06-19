"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-margin-mobile">
      <div className="flex flex-col items-center text-center">
        {/* Logo icon */}
        <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-6">
          <MaterialIcon
            name="potted_plant"
            className="text-growth-green"
            size={40}
            filled
          />
        </div>

        {/* 404 text */}
        <h1 className="font-headline-lg text-headline-lg text-growth-green mb-2">
          404
        </h1>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
          Page not found
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <Link
          href="/dashboard"
          className="bg-growth-green text-white font-button-text text-button-text rounded-lg h-12 px-8 flex items-center justify-center hover:bg-opacity-90 active:scale-95 transition-all"
        >
          Go back to Dashboard
        </Link>
      </div>
    </div>
  );
}
