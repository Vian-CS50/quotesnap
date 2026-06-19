"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";

const mobileItems = [
  { href: "/dashboard", label: "Home", icon: "dashboard" },
  { href: "/quote/new", label: "Quotes", icon: "request_quote" },
  { href: "/clients", label: "Clients", icon: "group" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-surface-variant flex justify-around items-center z-50">
      {mobileItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1",
              active ? "text-growth-green font-bold" : "text-on-surface-variant"
            )}
          >
            <MaterialIcon name={item.icon} filled={active} size={24} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
