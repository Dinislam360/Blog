
"use client";
import { useParams, notFound } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import { Navbar } from '@/components/Navbar';
import { PostCard } from '@/components/PostCard';
import type { Post } from '@/types';

export default function CategoryPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { posts, categories, getCategoryBySlug } = useAppContext();

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
  return (
    <footer className="py-8 border-t bg-muted/50">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Apex Blogs. All rights reserved.</p>
      </div>
    </footer>
  );
}
