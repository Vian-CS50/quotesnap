"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Public pages (login/signup) should stay mounted so form state isn't wiped
  // when the global auth loading state toggles during signup/login.
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin w-8 h-8 border-2 border-growth-green border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
