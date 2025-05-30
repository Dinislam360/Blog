
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import type { NavItem } from '@/types';
import { LayoutDashboard, FileText, Tags, Settings, LogOut, ExternalLink } from 'lucide-react';

const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Posts', href: '/admin/posts', icon: FileText },
  { title: 'Categories', href: '/admin/categories', icon: Tags },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-sidebar text-sidebar-foreground flex flex-col fixed left-0 top-0 shadow-lg z-40">
      <div className="p-6 border-b border-sidebar-border">
        <Logo color="text-sidebar-primary-foreground" textSize="text-2xl" />
      </div>
      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {adminNavItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
              pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              item.disabled && 'cursor-not-allowed opacity-50'
            )}
            aria-disabled={item.disabled}
            onClick={(e) => item.disabled && e.preventDefault()}
          >
            {item.icon && <item.icon className="h-5 w-5" />}
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t border-sidebar-border space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" asChild>
          <Link href="/" target="_blank">
            <ExternalLink className="h-5 w-5" />
            View Site
          </Link>
        </Button>
        <Button variant="ghost" onClick={() => logout()} className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
