
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

const POSTS_STORAGE_KEY = 'apex_blogs_posts';
const CATEGORIES_STORAGE_KEY = 'apex_blogs_categories';
const SETTINGS_STORAGE_KEY = 'apex_blogs_settings';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
        return storedPosts ? JSON.parse(storedPosts) : mockPosts;
      } catch (error) {
        console.warn("Error reading posts from localStorage:", error);
        return mockPosts;
      }
    }
    return mockPosts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        return storedCategories ? JSON.parse(storedCategories) : mockCategories;
      } catch (error) {
        console.warn("Error reading categories from localStorage:", error);
        return mockCategories;
      }
    }
    return mockCategories;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
     if (typeof window !== 'undefined') {
      try {
        const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        return storedSettings ? JSON.parse(storedSettings) : mockSiteSettings;
      } catch (error) {
        console.warn("Error reading site settings from localStorage:", error);
        return mockSiteSettings;
      }
    }
    return mockSiteSettings;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      } catch (error) {
        console.warn("Error writing posts to localStorage:", error);
      }
    }
  }, [posts]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      } catch (error) {
        console.warn("Error writing categories to localStorage:", error);
      }
    }
  }, [categories]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(siteSettings));
      } catch (error) {
        console.warn("Error writing site settings to localStorage:", error);
      }
    }
  }, [siteSettings]);


  const addPost = (postData: Omit<Post, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Post => {
    const newPost: Post = {
      ...postData,
      id: String(Date.now() + Math.random()), // Added Math.random() for better uniqueness
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
      id: String(Date.now() + Math.random()), // Added Math.random() for better uniqueness
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
