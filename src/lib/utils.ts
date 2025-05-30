import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(title: string): string {
  if (!title) return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

// Helper to get category by ID (useful for displaying post category name)
import type { Category } from '@/types';
export function getCategoryName(categoryId: string, categories: Category[]): string {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : 'Uncategorized';
}

// Helper to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
