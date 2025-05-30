
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

export const ProtectRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname.startsWith('/admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading && pathname.startsWith('/admin')) {
    // Show a loading skeleton or spinner while checking auth status
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Skeleton className="h-12 w-12 rounded-full bg-primary/20 mb-4" />
        <Skeleton className="h-8 w-48 bg-muted mb-2" />
        <Skeleton className="h-6 w-32 bg-muted" />
      </div>
    );
  }

  if (!isAuthenticated && pathname.startsWith('/admin')) {
    // Handles the case where redirect hasn't happened yet or JS is disabled (though redirect is client-side)
    return null; 
  }

  return <>{children}</>;
};
