"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface TopNavProps {
  title?: string;
}

export function TopNav({ title }: TopNavProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface border-b border-surface-variant h-16 flex justify-between items-center px-8 md:pl-72 md:pr-8">
      <div className="flex items-center gap-4">
        <span className="font-headline-md text-headline-md font-bold text-growth-green md:hidden">
          QuoteSnap Pro
        </span>
        {title && <span className="hidden md:block font-headline-md text-headline-md font-bold text-growth-green">{title}</span>}
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-lg border border-outline-variant">
          <MaterialIcon name="search" className="text-on-surface-variant" size={20} />
          <input
            className="bg-transparent border-none focus:ring-0 text-body-sm w-48 outline-none"
            placeholder="Search..."
            type="text"
          />
        </div>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full">
          <MaterialIcon name="notifications" size={22} />
        </button>
        <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high flex items-center justify-center">
          <MaterialIcon name="account_circle" className="text-on-surface-variant" size={32} />
        </div>
      </div>
    </header>
  );
}
