
"use client";
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { useAppContext } from '@/contexts/AppContext';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Tag } from 'lucide-react';
import { formatDate, getCategoryName } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function PostPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { getPostBySlug, categories } = useAppContext();
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
          
          {post.seoKeywords && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-md font-semibold mb-2 flex items-center">
                <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.seoKeywords.split(',').map(keyword => (
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
  return (
    <footer className="py-8 border-t bg-muted/50">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Apex Blogs. All rights reserved.</p>
      </div>
    </footer>
  );
}
