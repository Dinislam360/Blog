
"use client";
import { useEffect, useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import type { Post, Category } from '@/types';
import { generateSlug } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateSEOTitles, type GenerateSEOTitlesInput, type GenerateSEOTitlesOutput } from '@/ai/flows/generate-seo-titles';
import { SeoSuggestionsModal } from './SeoSuggestionsModal';
import { Sparkles, Loader2, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RichTextEditor } from './RichTextEditor'; // ADDED
import { Textarea } from '@/components/ui/textarea';


const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  content: z.string().min(10, 'Content must be at least 10 characters long (HTML content)'),
  featuredImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  dataAiHint: z.string().max(50, "AI hint should be concise (max 50 chars).").optional(),
  categoryId: z.string().min(1, 'Category is required'),
  seoKeywords: z.string().optional(),
  seoDescription: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  post?: Post; // For editing
}

export function PostForm({ post }: PostFormProps) {
  const { categories, addPost, updatePost } = useAppContext();
  const { toast } = useToast();
  const router = useRouter();
  const [slug, setSlug] = useState(post?.slug || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [seoSuggestions, setSeoSuggestions] = useState<GenerateSEOTitlesOutput | null>(null);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);

  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      featuredImage: post?.featuredImage || '',
      dataAiHint: post?.dataAiHint || '',
      categoryId: post?.categoryId || '',
      seoKeywords: post?.seoKeywords || '',
      seoDescription: post?.seoDescription || '',
    },
  });

  const watchedTitle = watch('title');
  useEffect(() => {
    if (watchedTitle && (!post || watchedTitle !== post.title)) { // Only auto-generate if new or title changed
      setSlug(generateSlug(watchedTitle));
    }
  }, [watchedTitle, post]);

  const onSubmit: SubmitHandler<PostFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      if (post) {
        updatePost({ ...post, ...data, slug }); // Ensure slug is updated if title changes
        toast({ title: 'Post Updated', description: 'Your post has been successfully updated.' });
      } else {
        const newPost = addPost({ ...data, slug });
        toast({ title: 'Post Created', description: 'Your new post has been successfully created.' });
      }
      router.push('/admin/posts');
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateSeo = async () => {
    const content = watch('content'); // This will be HTML content
    // For AI, we might want to strip HTML or use a library to get text content
    // For simplicity, we'll send HTML for now, or we can use editor.getText() if we had access to editor instance
    if (!content || content.length < 50) { // Check HTML length, might need adjustment
      toast({ title: "Content too short", description: "Please write at least 50 characters of content to generate SEO suggestions.", variant: "destructive" });
      return;
    }
    setIsGeneratingSeo(true);
    try {
      // Consider stripping HTML from 'content' before sending to AI if it expects plain text
      const plainTextContent = new DOMParser().parseFromString(content, "text/html").body.textContent || "";
      if (plainTextContent.length < 50) {
        toast({ title: "Text Content too short", description: "Please write at least 50 characters of actual text content.", variant: "destructive" });
        setIsGeneratingSeo(false);
        return;
      }
      const input: GenerateSEOTitlesInput = { content: plainTextContent };
      const result = await generateSEOTitles(input);
      setSeoSuggestions(result);
      setIsSeoModalOpen(true);
    } catch (error) {
      console.error("Error generating SEO titles:", error);
      toast({ title: "AI Error", description: "Could not generate SEO suggestions. Please try again.", variant: "destructive" });
    } finally {
      setIsGeneratingSeo(false);
    }
  };
  
  const handleSelectSuggestedTitle = (suggestedTitle: string) => {
    setValue('title', suggestedTitle);
    setIsSeoModalOpen(false);
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{post ? 'Edit Post' : 'Create New Post'}</CardTitle>
            <CardDescription>Fill in the details for your blog post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} placeholder="Your Awesome Post Title" className={errors.title ? 'border-destructive' : ''} />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
              {slug && <p className="text-xs text-muted-foreground mt-1">Slug: /posts/{slug}</p>}
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
               <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
            </div>

            <Button type="button" variant="outline" onClick={handleGenerateSeo} disabled={isGeneratingSeo || isSubmitting}>
              {isGeneratingSeo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate SEO Suggestions (AI)
            </Button>
            
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input id="featuredImage" {...register('featuredImage')} placeholder="https://placehold.co/800x400.png" className={errors.featuredImage ? 'border-destructive' : ''} />
              {errors.featuredImage && <p className="text-sm text-destructive mt-1">{errors.featuredImage.message}</p>}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="dataAiHint">AI Image Hint</Label>
                <Tooltip>
                  <TooltipTrigger type="button" onClick={(e) => e.preventDefault()}>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">
                      Provide 1-2 keywords (e.g., "abstract tech", "forest landscape") to guide AI placeholder image generation. Used for `data-ai-hint` attribute.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input 
                id="dataAiHint" 
                {...register('dataAiHint')} 
                placeholder="e.g., technology abstract, travel landscape" 
                className={errors.dataAiHint ? 'border-destructive' : ''} 
              />
              {errors.dataAiHint && <p className="text-sm text-destructive mt-1">{errors.dataAiHint.message}</p>}
            </div>


            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <SelectTrigger className={errors.categoryId ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category: Category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && <p className="text-sm text-destructive mt-1">{errors.categoryId.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>SEO Optimization</CardTitle>
            <CardDescription>Customize keywords and description for search engines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="seoKeywords">SEO Keywords</Label>
              <Input id="seoKeywords" {...register('seoKeywords')} placeholder="e.g., tech, programming, nextjs" disabled={isSubmitting}/>
              <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords.</p>
            </div>

            <div>
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea id="seoDescription" {...register('seoDescription')} placeholder="A brief description for search engines." rows={3} disabled={isSubmitting} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {post ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
      {seoSuggestions && (
        <SeoSuggestionsModal
          isOpen={isSeoModalOpen}
          onClose={() => setIsSeoModalOpen(false)}
          titles={seoSuggestions.alternativeTitles}
          headings={seoSuggestions.alternativeHeadings}
          onSelectTitle={handleSelectSuggestedTitle}
        />
      )}
    </TooltipProvider>
  );
}
