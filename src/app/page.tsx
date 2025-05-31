
"use client";
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { PostCard } from '@/components/PostCard';
import { useAppContext } from '@/contexts/AppContext';
import type { Post, Category, SocialLink } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CalendarDays, Twitter, Github, Linkedin, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { formatDate, getCategoryName } from '@/lib/utils';
import React from 'react'; // Added for React.cloneElement

// Helper to get appropriate Lucide icon (for Footer)
const getSocialIcon = (platform: string) => {
  const lowerPlatform = platform.toLowerCase();
  if (lowerPlatform.includes('twitter')) return <Twitter className="h-5 w-5" />;
  if (lowerPlatform.includes('github')) return <Github className="h-5 w-5" />;
  if (lowerPlatform.includes('linkedin')) return <Linkedin className="h-5 w-5" />;
  if (lowerPlatform.includes('facebook')) return <Facebook className="h-5 w-5" />;
  if (lowerPlatform.includes('instagram')) return <Instagram className="h-5 w-5" />;
  if (lowerPlatform.includes('youtube')) return <Youtube className="h-5 w-5" />;
  return <ExternalLink className="h-5 w-5" />;
};


export default function HomePage() {
  const { posts, categories, siteSettings, isInitialDataLoaded } = useAppContext();
  const [featuredPostExcerpt, setFeaturedPostExcerpt] = useState('');

  const sortedPosts = useMemo(() =>
    [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [posts]
  );

  const featuredPost = useMemo(() =>
    sortedPosts.find(post => post.featuredImage),
    [sortedPosts]
  );

  const latestPosts = useMemo(() => {
    const postsToShow = featuredPost
      ? sortedPosts.filter(post => post.id !== featuredPost.id)
      : sortedPosts;
    return postsToShow.slice(0, 6);
  }, [sortedPosts, featuredPost]);

  useEffect(() => {
    if (featuredPost?.content) {
      if (typeof window !== 'undefined') { // Ensure DOMParser is used client-side
        const parser = new DOMParser();
        const doc = parser.parseFromString(featuredPost.content, 'text/html');
        const textContent = doc.body.textContent || "";
        setFeaturedPostExcerpt(textContent.substring(0, 180) + (textContent.length > 180 ? '...' : ''));
      }
    } else {
      setFeaturedPostExcerpt('');
    }
  }, [featuredPost]);

  if (!isInitialDataLoaded) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {/* Skeleton for Featured Post */}
          <div className="mb-12 p-4 sm:p-6 bg-card rounded-lg shadow-xl animate-pulse">
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:min-h-[300px] bg-muted rounded-md mb-4 md:mb-0 md:mr-6"></div>
              <div className="md:w-1/2 flex flex-col justify-center">
                <div className="h-8 w-3/4 bg-muted rounded mb-4"></div> {/* Title */}
                <div className="h-4 w-1/2 bg-muted rounded mb-2"></div> {/* Date/Category */}
                <div className="h-4 w-full bg-muted rounded mb-1"></div> {/* Excerpt line 1 */}
                <div className="h-4 w-full bg-muted rounded mb-1"></div> {/* Excerpt line 2 */}
                <div className="h-4 w-5/6 bg-muted rounded mb-6"></div> {/* Excerpt line 3 */}
                <div className="h-12 w-36 bg-primary rounded"></div> {/* Button */}
              </div>
            </div>
          </div>
          {/* Skeleton for Latest Posts title */}
          <div className="h-8 w-1/4 bg-muted rounded mb-6 mt-12"></div>
          {/* Skeleton for Latest Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card p-4 rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-muted rounded mb-4"></div>
                <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-muted rounded mb-4"></div>
                <div className="h-10 w-full bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!posts.length) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">{siteSettings.siteTitle || 'Welcome to Our Blog'}</h1>
            <p className="text-muted-foreground text-lg mb-8">No posts available yet. Check back soon or create some in the admin panel!</p>
            <Button asChild size="lg">
              <Link href="/admin/posts/new">Create First Post</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Featured Post Section */}
        {featuredPost && (
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-primary mb-6 pb-2 border-b">Featured Post</h2>
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group bg-card">
              <div className="md:flex">
                {featuredPost.featuredImage && (
                  <div className="md:w-1/2 relative h-64 sm:h-80 md:h-auto md:min-h-[350px] overflow-hidden">
                    <Image
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-105"
                      priority
                      data-ai-hint={featuredPost.dataAiHint || "featured story"}
                    />
                  </div>
                )}
                <div className={`p-6 md:p-8 flex flex-col justify-center ${featuredPost.featuredImage ? 'md:w-1/2' : 'w-full'}`}>
                  <CardTitle className="text-2xl lg:text-3xl font-bold leading-tight mb-3">
                    <Link href={`/posts/${featuredPost.slug}`} className="hover:text-primary transition-colors">
                      {featuredPost.title}
                    </Link>
                  </CardTitle>
                  <div className="text-sm text-muted-foreground mb-4 flex items-center flex-wrap gap-x-3 gap-y-1">
                    <span className="flex items-center">
                      <CalendarDays className="mr-1.5 h-4 w-4" />
                      {formatDate(featuredPost.createdAt)}
                    </span>
                    {categories.find(c => c.id === featuredPost.categoryId) && (
                       <Badge variant="secondary" className="capitalize">{getCategoryName(featuredPost.categoryId, categories)}</Badge>
                    )}
                  </div>
                  {featuredPostExcerpt && (
                    <p className="text-muted-foreground mb-6 text-base leading-relaxed line-clamp-4">
                      {featuredPostExcerpt}
                    </p>
                  )}
                  <Button variant="default" size="lg" asChild className="self-start mt-auto">
                    <Link href={`/posts/${featuredPost.slug}`}>
                      Read More <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Latest Posts Section */}
        {(latestPosts.length > 0 || (!featuredPost && posts.length > 0)) && (
          <section className={featuredPost ? "mt-16" : ""}>
             <h2 className="text-3xl font-semibold text-primary mb-6 pb-2 border-b">
              {posts.length > 0 ? (featuredPost ? 'More Posts' : 'Latest Posts') : ''}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post: Post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  categoryName={getCategoryName(post.categoryId, categories)} 
                />
              ))}
            </div>
          </section>
        )}
        
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  const { siteSettings, isInitialDataLoaded } = useAppContext();
  const defaultCopyright = `© ${new Date().getFullYear()} ${siteSettings.siteTitle || 'Apex Blogs'}. All rights reserved.`;
  const defaultTagline = 'Powered by Next.js & ShadCN UI';

  const copyrightText = isInitialDataLoaded && siteSettings.footerCopyright ? siteSettings.footerCopyright : defaultCopyright;
  const taglineText = isInitialDataLoaded && siteSettings.footerTagline ? siteSettings.footerTagline : defaultTagline;
  const socialLinks = isInitialDataLoaded ? (siteSettings.socialLinks || []) : [];

  return (
    <footer className="bg-card text-card-foreground border-t border-border/60 shadow-inner mt-16">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <p className="font-semibold text-lg">{copyrightText}</p>
            {taglineText && <p className="text-sm mt-1 opacity-80">{taglineText}</p>}
          </div>
          {socialLinks.length > 0 && (
            <div className="flex justify-center md:justify-end space-x-5">
              {socialLinks.map((link: SocialLink) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.platform}
                  className="text-card-foreground/70 hover:text-primary transition-colors duration-300"
                >
                  {React.cloneElement(getSocialIcon(link.platform), { className: "h-6 w-6" })}
                  <span className="sr-only">{link.platform}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
