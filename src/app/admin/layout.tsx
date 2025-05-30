
import type { ReactNode } from 'react';
import { ProtectRoute } from '@/components/auth/ProtectRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectRoute>
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-6 sm:p-8 ml-64 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectRoute>
  );
}
