"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/quote/new", label: "Quotes", icon: "request_quote" },
  { href: "/clients", label: "Clients", icon: "group" },
  { href: "/materials", label: "Materials", icon: "inventory_2" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-surface-container-low border-r border-surface-variant flex flex-col pt-20 pb-4 hidden md:flex">
      <div className="px-6 mb-8">
        <h2 className="font-headline-sm text-headline-sm font-bold text-growth-green">QuoteSnap Pro</h2>
        <p className="text-xs text-on-surface-variant opacity-70 font-label-mono">Field Logic System</p>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all",
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
      <div className="px-6 py-4 border-t border-outline-variant mt-auto">
        <p className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant opacity-60">
          System v2.4.0
        </p>
      </div>
    </aside>
  );
}
