
"use client";
import { Navbar } from '@/components/Navbar';
import { PostCard } from '@/components/PostCard';
import { useAppContext } from '@/contexts/AppContext';
import type { Post, Category, SocialLink } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Twitter, Github, Linkedin, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react'; // Add more as needed

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


export default function HomePage() {
  const { posts, categories, isInitialDataLoaded } = useAppContext();

  if (!isInitialDataLoaded) {
     return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="h-10 w-1/2 bg-muted rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-3/4 bg-muted rounded animate-pulse mx-auto mb-8"></div>
            <div className="h-12 w-40 bg-primary rounded animate-pulse mx-auto"></div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!posts.length || !categories.length) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Welcome to Apex Blogs</h1>
            <p className="text-muted-foreground text-lg mb-8">No posts available yet. Start by adding some content in the admin panel!</p>
            <Button asChild size="lg">
              <Link href="/admin/posts/new">Create First Post</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Sort all posts by creation date, newest first
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {categories.map((category: Category) => {
          // Filter from the globally sorted posts
          const postsInCategory = sortedPosts.filter((post: Post) => post.categoryId === category.id);
          if (postsInCategory.length === 0) {
            return null; // Don't render category if no posts
          }
          return (
            <section key={category.id} className="mb-12">
              <div className="flex justify-between items-center mb-6 pb-2 border-b">
                <h2 className="text-3xl font-semibold text-primary">{category.name}</h2>
                <Button variant="link" asChild>
                  <Link href={`/categories/${category.slug}`}>View all in {category.name}</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Posts are already sorted correctly from sortedPosts */}
                {postsInCategory.map((post: Post) => (
                  <PostCard key={post.id} post={post} categoryName={category.name} />
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </div>
  );
}


function Footer() {
  const { siteSettings, isInitialDataLoaded } = useAppContext();
  const defaultCopyright = `© ${new Date().getFullYear()} Apex Blogs. All rights reserved.`;
  const defaultTagline = 'Powered by Next.js & ShadCN UI';

  const copyrightText = isInitialDataLoaded && siteSettings.footerCopyright ? siteSettings.footerCopyright : defaultCopyright;
  const taglineText = isInitialDataLoaded && siteSettings.footerTagline ? siteSettings.footerTagline : defaultTagline;
  const socialLinks = isInitialDataLoaded ? (siteSettings.socialLinks || []) : [];


  return (
    <footer className="py-8 border-t bg-muted/50">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>{copyrightText}</p>
        {taglineText && <p className="text-sm mt-1">{taglineText}</p>}
         {socialLinks.length > 0 && (
          <div className="flex justify-center space-x-4 mt-4">
            {socialLinks.map((link: SocialLink) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.platform}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {getSocialIcon(link.platform)}
                <span className="sr-only">{link.platform}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
