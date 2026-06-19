"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";

const mobileItems = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/quote/new", label: "Quotes", icon: "request_quote" },
  { href: "/clients", label: "Clients", icon: "group" },
  { href: "/materials", label: "Materials", icon: "inventory_2" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-surface-subtle z-50 flex justify-around items-center pb-safe md:hidden">
      {mobileItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center min-h-[44px] min-w-[44px] active:scale-90 transition-transform",
              active
                ? "bg-primary-container text-on-primary-container rounded-full px-4 py-1 font-semibold gap-1"
                : "text-on-surface-variant gap-1"
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
