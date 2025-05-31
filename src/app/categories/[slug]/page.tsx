
"use client";
import { useParams, notFound } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import { Navbar } from '@/components/Navbar';
import { PostCard } from '@/components/PostCard';
import type { Post, SocialLink } from '@/types'; 
import Link from 'next/link';
import { Twitter, Github, Linkedin, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react'; 
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


export default function CategoryPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { posts, categories, getCategoryBySlug, isInitialDataLoaded } = useAppContext();


  if (!isInitialDataLoaded) {
    // Basic loading state, can be enhanced with skeletons
    return (
       <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8 flex-grow">
            <div className="h-10 w-1/3 bg-muted rounded animate-pulse mb-8 pb-4 border-b"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3].map(i => (
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
      </div>
    );
  }
  
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const postsInCategory = posts.filter((post: Post) => post.categoryId === category.id);
  // Sort posts in this category by creation date, newest first
  const sortedPostsInCategory = [...postsInCategory].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <header className="mb-8 pb-4 border-b">
          <h1 className="text-4xl font-bold text-primary">Category: {category.name}</h1>
        </header>
        {sortedPostsInCategory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPostsInCategory.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg">No posts found in this category yet.</p>
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
