
"use client";
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import type { Category } from '@/types';
import { generateSlug } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters long'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onFormSubmit?: () => void; // Callback after successful submission, e.g., to close a dialog
}

export function CategoryForm({ category, onFormSubmit }: CategoryFormProps) {
  const { addCategory, updateCategory } = useAppContext();
  const { toast } = useToast();
  const [slug, setSlug] = useState(category?.slug || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
    },
  });

  const watchedName = watch('name');
  useEffect(() => {
    if (watchedName !== undefined) { // Ensure watchedName is not undefined initially
        setSlug(generateSlug(watchedName));
    }
  }, [watchedName]);
  
  useEffect(() => {
    // Reset form when category prop changes (e.g. when switching to edit another category or clearing form)
    reset({ name: category?.name || '' });
    setSlug(category?.slug || generateSlug(category?.name || ''));
  }, [category, reset]);


  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      if (category) {
        updateCategory({ ...category, ...data, slug });
        toast({ title: 'Category Updated', description: `Category "${data.name}" has been updated.` });
      } else {
        addCategory({ ...data, slug });
        toast({ title: 'Category Created', description: `Category "${data.name}" has been created.` });
        reset(); // Clear form after successful creation
        setSlug('');
      }
      if (onFormSubmit) onFormSubmit();
    } catch (error) {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle>{category ? 'Edit Category' : 'Create New Category'}</CardTitle>
        <CardDescription>{category ? `Update the details for "${category.name}".` : 'Add a new category for your posts.'}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" {...register('name')} placeholder="e.g., Technology" className={errors.name ? 'border-destructive' : ''}/>
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            {slug && <p className="text-xs text-muted-foreground mt-1">Slug: /categories/{slug}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {category ? 'Update Category' : 'Create Category'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
