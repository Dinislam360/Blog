
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Post, Category, SiteSettings } from '@/types';
import { mockPosts, mockCategories, mockSiteSettings } from '@/lib/mock-data';
import { generateSlug } from '@/lib/utils';

interface AppContextType {
  posts: Post[];
  categories: Category[];
  siteSettings: SiteSettings;
  addPost: (post: Omit<Post, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => Post;
  updatePost: (post: Post) => void;
  getPostById: (id: string) => Post | undefined;
  getPostBySlug: (slug: string) => Post | undefined;
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => Category;
  updateCategory: (category: Category) => void;
  getCategoryById: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(mockSiteSettings);

  useEffect(() => {
    // Initialize with mock data
    setPosts(mockPosts);
    setCategories(mockCategories);
    setSiteSettings(mockSiteSettings);
  }, []);

  const addPost = (postData: Omit<Post, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Post => {
    const newPost: Post = {
      ...postData,
      id: String(Date.now()),
      slug: generateSlug(postData.title),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
    return newPost;
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(prevPosts =>
      prevPosts.map(p => (p.id === updatedPost.id ? { ...updatedPost, slug: generateSlug(updatedPost.title), updatedAt: new Date().toISOString() } : p))
    );
  };

  const getPostById = (id: string) => posts.find(p => p.id === id);
  const getPostBySlug = (slug: string) => posts.find(p => p.slug === slug);

  const addCategory = (categoryData: Omit<Category, 'id' | 'slug'>): Category => {
    const newCategory: Category = {
      ...categoryData,
      id: String(Date.now()),
      slug: generateSlug(categoryData.name),
    };
    setCategories(prevCategories => [newCategory, ...prevCategories]);
    return newCategory;
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prevCategories =>
      prevCategories.map(c => (c.id === updatedCategory.id ? { ...updatedCategory, slug: generateSlug(updatedCategory.name) } : c))
    );
  };
  
  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);

  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
  };

  return (
    <AppContext.Provider
      value={{
        posts,
        categories,
        siteSettings,
        addPost,
        updatePost,
        getPostById,
        getPostBySlug,
        addCategory,
        updateCategory,
        getCategoryById,
        getCategoryBySlug,
        updateSiteSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
