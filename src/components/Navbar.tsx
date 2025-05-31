
"use client";
import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogIn } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile'; 
import { cn } from '@/lib/utils';

export function Navbar() {
  const { categories } = useAppContext();
  const isMobile = useIsMobile();

  const navItems = [
    { title: 'Home', href: '/' },
    ...categories.slice(0, 3).map(cat => ({ title: cat.name, href: `/categories/${cat.slug}` })),
    // Add more static links if needed e.g. { title: 'About', href: '/about' }
  ];

  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo iconSize={24} textSize="text-xl" isMobile={true} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
              <div className="p-6">
                <Logo iconSize={28} textSize="text-2xl" />
              </div>
              <nav className="flex flex-col gap-2 p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="mt-4 block rounded-md px-3 py-2 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 text-center"
                >
                  Admin Login
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Button asChild variant="outline">
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" /> Admin Login
          </Link>
        </Button>
      </div>
    </header>
  );
}
