
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  categoryName?: string;
}

export function PostCard({ post, categoryName }: PostCardProps) {
  const excerpt = post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '');

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {post.featuredImage && (
        <div className="relative w-full h-48">
          <Image
            src={post.featuredImage}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={post.dataAiHint || "blog abstract"}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl font-semibold leading-tight hover:text-primary transition-colors">
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </CardTitle>
        {categoryName && (
          <Badge variant="secondary" className="mt-2 w-fit">{categoryName}</Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{excerpt}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t">
        <div className="text-xs text-muted-foreground mb-2 sm:mb-0 flex items-center">
          <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
          {formatDate(post.createdAt)}
        </div>
        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/90">
          <Link href={`/posts/${post.slug}`}>
            Read More <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
