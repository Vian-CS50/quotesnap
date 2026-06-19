"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface TopNavProps {
  title?: string;
}

const drawerNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/quote/new", label: "Quotes", icon: "request_quote" },
  { href: "/clients", label: "Clients", icon: "group" },
  { href: "/materials", label: "Materials", icon: "inventory_2" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function TopNav({ title }: TopNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : undefined;

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface border-b border-surface-subtle h-16 flex items-center justify-between px-4 md:px-8 md:pl-72">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <MaterialIcon name="menu" size={24} />
          </button>
          <span className="font-headline-md text-headline-md font-bold text-growth-green md:hidden">
            QuoteSnap
          </span>
          <span className="hidden md:block font-headline-md text-headline-md font-bold text-growth-green">
            {title || "QuoteSnap"}
          </span>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <MaterialIcon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              size={20}
            />
            <input
              className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 w-64 text-body-sm focus:ring-1 focus:ring-growth-green outline-none placeholder:text-on-surface-variant/50"
              placeholder="Search projects or clients..."
              type="text"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <button
            className="hidden md:flex p-2.5 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full active:scale-95 min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="Voice input"
          >
            <MaterialIcon name="mic" size={22} />
          </button>
          <button
            className="relative p-2.5 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Notifications"
          >
            <MaterialIcon name="notifications" size={22} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>
          <div className="h-10 w-10 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high flex items-center justify-center text-on-surface font-semibold text-sm">
            {userInitial ? (
              <span>{userInitial}</span>
            ) : (
              <MaterialIcon name="account_circle" className="text-on-surface-variant" size={32} />
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-surface-base border-r border-surface-subtle flex flex-col">
            <div className="flex items-center justify-between px-6 h-16 border-b border-surface-subtle">
              <span className="font-headline-sm text-headline-sm font-bold text-growth-green">
                QuoteSnap
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <MaterialIcon name="close" size={24} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
              {drawerNavItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all active:scale-95 min-h-[44px]",
                      active
                        ? "bg-primary-container text-on-primary-container font-semibold"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    )}
                  >
                    <MaterialIcon name={item.icon} filled={active} size={22} />
                    <span className="font-body-md">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
