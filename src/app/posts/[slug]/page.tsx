
"use client";
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { useAppContext } from '@/contexts/AppContext';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Tag, Twitter, Github, Linkedin, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { formatDate, getCategoryName } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import type { SocialLink } from '@/types'; 
import Link from 'next/link';
import React from 'react'; // Added for React.cloneElement

// Helper to get appropriate Lucide icon
const getSocialIcon = (platform: string) => {
  const lowerPlatform = platform.toLowerCase();
  if (lowerPlatform.includes('twitter')) return <Twitter className="h-5 w-5" />;
  if (lowerPlatform.includes('github')) return <Github className="h-5 w-5" />;
  if (lowerPlatform.includes('linkedin')) return <Linkedin className="h-5 w-5" />;
  if (lowerPlatform.includes('facebook')) return <Facebook className="h-5 w-5" />;
  if (lowerPlatform.includes('instagram')) return <Instagram className="h-5 w-5" />;
  if (lowerPlatform.includes('youtube')) return <Youtube className="h-5 w-5" />;
  return <ExternalLink className="h-5 w-5" />; // Default icon
};


export default function PostPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { getPostBySlug, categories, isInitialDataLoaded } = useAppContext();
  

  if (!isInitialDataLoaded) {
    // Basic loading state for post page
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <article className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-lg animate-pulse">
            <div className="h-80 bg-muted rounded-md mb-8"></div>
            <div className="h-10 w-3/4 bg-muted rounded mb-3"></div>
            <div className="h-6 w-1/2 bg-muted rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    );
  }
  
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const categoryName = getCategoryName(post.categoryId, categories);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <article className="max-w-3xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-lg">
          {post.featuredImage && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 mb-8 rounded-md overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint={post.dataAiHint || "article detail"}
              />
            </div>
          )}
          <header className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3">{post.title}</h1>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-2">
              <div className="flex items-center">
                <CalendarDays className="mr-1.5 h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              {categoryName && (
                <Badge variant="secondary" className="capitalize">
                  {categoryName}
                </Badge>
              )}
            </div>
          </header>
          
          <Separator className="my-6" />

          <div
            className="prose prose-lg max-w-none dark:prose-invert" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
          
          {post.seoKeywords && post.seoKeywords.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-md font-semibold mb-2 flex items-center">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.seoKeywords.split(',').map(keyword => keyword.trim() && (
                  <Badge key={keyword.trim()} variant="outline">{keyword.trim()}</Badge>
                ))}
              </div>
            </div>
          )}
        </article>
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
