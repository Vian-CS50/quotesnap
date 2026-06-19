"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/quote/new", label: "Quotes", icon: "request_quote" },
  { href: "/clients", label: "Clients", icon: "group" },
  { href: "/materials", label: "Materials", icon: "inventory_2" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function SideNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-surface-subtle bg-surface-base pt-20 pb-4 md:flex">
      {/* Brand */}
      <div className="px-6 mb-8">
        <h2 className="font-headline-sm text-headline-sm font-bold text-growth-green">QuoteSnap Pro</h2>
        <p className="font-label-mono text-label-mono text-on-surface-variant opacity-70 mt-1">Active Session</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
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

      {/* Bottom Section: CTA + Support + Sign Out */}
      <div className="px-6 py-4 space-y-3 border-t border-surface-subtle">
        <Link
          href="/quote/new"
          className="flex items-center justify-center gap-2 w-full bg-growth-green text-white font-button-text rounded-lg py-3 hover:bg-opacity-90 active:scale-95 transition-all"
        >
          <MaterialIcon name="add" size={20} />
          <span>Create Estimate</span>
        </Link>
        <div className="space-y-1">
          <Link
            href="/support"
            className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-95 min-h-[44px]"
          >
            <MaterialIcon name="help" size={20} />
            <span className="font-body-sm">Support</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 w-full text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all active:scale-95 text-left min-h-[44px]"
          >
            <MaterialIcon name="logout" size={20} />
            <span className="font-body-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Version Footer */}
      <div className="px-6 py-3 border-t border-surface-subtle">
        <p className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant opacity-60">
          System v2.4.0
        </p>
      </div>
    </aside>
  );
}
