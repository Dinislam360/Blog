
"use client";
import { Navbar } from '@/components/Navbar';
import { PostCard } from '@/components/PostCard';
import { useAppContext } from '@/contexts/AppContext';
import type { Post, Category } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { posts, categories } = useAppContext();

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
  return (
    <footer className="py-8 border-t bg-muted/50">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Apex Blogs. All rights reserved.</p>
        <p className="text-sm mt-1">Powered by Next.js & ShadCN UI</p>
      </div>
    </footer>
  );
}
