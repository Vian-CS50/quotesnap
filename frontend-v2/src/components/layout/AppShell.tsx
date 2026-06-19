"use client";

import { ReactNode } from "react";
import { SideNav } from "./SideNav";
import { TopNav } from "./TopNav";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  footer?: ReactNode;
}

export function AppShell({ children, title, footer }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <TopNav title={title} />
      <SideNav />
      <main className="md:ml-64 pt-16 pb-16 md:pb-0 min-h-screen flex flex-col">
        {children}
        {footer || <Footer />}
      </main>
      <MobileNav />
    </div>
  );
}
