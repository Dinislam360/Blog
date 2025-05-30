
"use client";
import { useParams, notFound, useRouter } from 'next/navigation';
import { PostForm } from '@/components/admin/PostForm';
import { useAppContext } from '@/contexts/AppContext';
import { useEffect, useState } from 'react';
import type { Post } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const { getPostById } = useAppContext();
  const [post, setPost] = useState<Post | undefined | null>(undefined); // undefined for loading, null for not found

  useEffect(() => {
    if (id) {
      const foundPost = getPostById(id);
      setPost(foundPost || null); // Set to null if not found after trying
    } else {
      router.push('/admin/posts'); // Redirect if no ID
    }
  }, [id, getPostById, router]);

  if (post === undefined) { // Loading state
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
        <div className="flex justify-end gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (post === null) { // Post not found after loading
    notFound();
  }
  
  return post ? <PostForm post={post} /> : null; // Render form if post is found
}
