
"use client";
import Link from 'next/link';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/contexts/AppContext';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogIn, Search as SearchIcon, X as XIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import type { Post } from '@/types';

export function Navbar() {
  const { categories, posts } = useAppContext();
  const isMobile = useIsMobile();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(lowercasedQuery) ||
      (post.content && post.content.toLowerCase().includes(lowercasedQuery))
    );
    setSearchResults(filteredPosts.slice(0, 5)); // Limit to 5 results
    setShowResults(true);
  }, [searchQuery, posts]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const navItems = [
    { title: 'Home', href: '/' },
    // Display all categories
    ...categories.map(cat => ({ title: cat.name, href: `/categories/${cat.slug}` })),
  ];

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery('');
  };

  const searchInputComponent = (
    <div className="relative" ref={searchContainerRef}>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search posts..."
          className="pl-10 pr-8 h-9 w-full sm:w-56 md:w-64" // Responsive width
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim().length > 0 && searchResults.length > 0 && setShowResults(true)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={() => {
              setSearchQuery('');
              setShowResults(false);
            }}
            aria-label="Clear search"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border shadow-lg rounded-md z-50 max-h-72 overflow-y-auto">
          <ul>
            {searchResults.map(post => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.slug}`}
                  onClick={handleResultClick}
                  className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground truncate"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showResults && searchResults.length === 0 && searchQuery.trim() !== '' && (
         <div className="absolute top-full mt-1 w-full bg-card border border-border shadow-lg rounded-md z-50 p-4">
          <p className="text-sm text-muted-foreground">No results found.</p>
        </div>
      )}
    </div>
  );

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
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0 flex flex-col">
              <div className="p-6 border-b">
                <Logo iconSize={28} textSize="text-2xl" />
              </div>
              <div className="p-4 border-b">
                {searchInputComponent}
              </div>
              <nav className="flex flex-col gap-1 p-4 flex-grow overflow-y-auto">
                {navItems.map((item) => (
                  <SheetTrigger asChild key={item.title}>
                    <Link
                      href={item.href}
                       onClick={handleResultClick} // Also clear search/results on nav
                      className={cn(
                        "block rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {item.title}
                    </Link>
                  </SheetTrigger>
                ))}
              </nav>
              <div className="p-4 mt-auto border-t">
                <SheetTrigger asChild>
                  <Link
                    href="/login"
                    onClick={handleResultClick}
                    className="block rounded-md px-3 py-2 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 text-center"
                  >
                    Admin Login
                  </Link>
                </SheetTrigger>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    );
  }

  // Desktop / Tablet
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Logo />
        {/* Navigation Menu for larger screens */}
        <NavigationMenu className="hidden lg:flex ml-6">
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

        {/* Spacer to push search and login to the right */}
        <div className="flex-grow" />

        <div className="flex items-center gap-3">
          {/* Search input component for desktop/tablet */}
          {searchInputComponent}
          
          <Button asChild variant="outline">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" /> Admin Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
