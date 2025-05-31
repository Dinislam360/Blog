
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Post, Category, SiteSettings, SocialLink } from '@/types';
import { mockPosts, mockCategories, mockSiteSettings } from '@/lib/mock-data';
import { generateSlug } from '@/lib/utils';

interface AppContextType {
  posts: Post[];
  categories: Category[];
  siteSettings: SiteSettings;
  addPost: (post: Omit<Post, 'id' | 'slug' | 'createdAt' | 'updatedAt'>) => Post;
  updatePost: (post: Post) => void;
  deletePost: (postId: string) => void;
  getPostById: (id: string) => Post | undefined;
  getPostBySlug: (slug: string) => Post | undefined;
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => Category;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void; // Added deleteCategory
  getCategoryById: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  isInitialDataLoaded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const POSTS_STORAGE_KEY = 'apex_blogs_posts_v2';
const CATEGORIES_STORAGE_KEY = 'apex_blogs_categories_v2';
const SETTINGS_STORAGE_KEY = 'apex_blogs_settings_v2';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => ({
    ...mockSiteSettings,
    socialLinks: mockSiteSettings.socialLinks
      ? mockSiteSettings.socialLinks.map((link: SocialLink) => ({ ...link }))
      : [],
  }));
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  const loadFromLocalStorage = useCallback(() => {
    let loadedPosts = [...mockPosts.map(p => ({...p}))];
    let loadedCategories = [...mockCategories.map(c => ({...c}))];
    let loadedSettings = {
      ...mockSiteSettings,
      socialLinks: mockSiteSettings.socialLinks
        ? mockSiteSettings.socialLinks.map((link: SocialLink) => ({ ...link }))
        : [],
    };

    if (typeof window !== 'undefined') {
      try {
        const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
        if (storedPosts) {
          loadedPosts = JSON.parse(storedPosts);
        }
      } catch (error) {
        console.warn("Error reading posts from localStorage, using mock data as fallback:", error);
      }

      try {
        const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
        if (storedCategories) {
          loadedCategories = JSON.parse(storedCategories);
        }
      } catch (error) {
        console.warn("Error reading categories from localStorage, using mock data as fallback:", error);
      }

      try {
        const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          loadedSettings = {
            ...mockSiteSettings,
            ...parsedSettings,
            socialLinks: parsedSettings.socialLinks
              ? parsedSettings.socialLinks.map((link: SocialLink) => ({ ...link }))
              : (mockSiteSettings.socialLinks ? mockSiteSettings.socialLinks.map((link: SocialLink) => ({ ...link })) : [])
          };
        }
      } catch (error) {
        console.warn("Error reading site settings from localStorage, using mock data as fallback:", error);
      }
    }

    setPosts(loadedPosts);
    setCategories(loadedCategories);
    setSiteSettings(loadedSettings);
    setIsInitialDataLoaded(true);
  }, []);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  useEffect(() => {
    if (isInitialDataLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
      } catch (error) {
        console.warn("Error writing posts to localStorage:", error);
      }
    }
  }, [posts, isInitialDataLoaded]);

  useEffect(() => {
    if (isInitialDataLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      } catch (error) {
        console.warn("Error writing categories to localStorage:", error);
      }
    }
  }, [categories, isInitialDataLoaded]);

  useEffect(() => {
    if (isInitialDataLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(siteSettings));
      } catch (error) {
        console.warn("Error writing site settings to localStorage:", error);
      }
    }
  }, [siteSettings, isInitialDataLoaded]);

  const addPost = (postData: Omit<Post, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Post => {
    const newPost: Post = {
      id: String(Date.now() + Math.random()),
      slug: generateSlug(postData.title),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...postData,
    };
    setPosts(prevPosts => [newPost, ...prevPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    return newPost;
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(prevPosts =>
      prevPosts.map(p => (p.id === updatedPost.id ? { ...updatedPost, slug: generateSlug(updatedPost.title), updatedAt: new Date().toISOString() } : p))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  };

  const deletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
  };

  const getPostById = (id: string) => posts.find(p => p.id === id);
  const getPostBySlug = (slug: string) => posts.find(p => p.slug === slug);

  const addCategory = (categoryData: Omit<Category, 'id' | 'slug'>): Category => {
    const newCategory: Category = {
      ...categoryData,
      id: String(Date.now() + Math.random()),
      slug: generateSlug(categoryData.name),
    };
    setCategories(prevCategories => [{...newCategory}, ...prevCategories]);
    return newCategory;
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prevCategories =>
      prevCategories.map(c => (c.id === updatedCategory.id ? { ...updatedCategory, slug: generateSlug(updatedCategory.name) } : c))
    );
  };

  const deleteCategory = (categoryId: string) => {
    const isCategoryInUse = posts.some(post => post.categoryId === categoryId);
    if (isCategoryInUse) {
      throw new Error("This category is in use by one or more posts. Please reassign or delete those posts first.");
    }
    setCategories(prevCategories => prevCategories.filter(c => c.id !== categoryId));
  };

  const getCategoryById = (id: string) => categories.find(c => c.id === id);
  const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);

  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings,
      socialLinks: newSettings.socialLinks
        ? newSettings.socialLinks.map(link => ({...link}))
        : (prevSettings.socialLinks ? prevSettings.socialLinks.map(link => ({...link})) : [])
    }));
  };

  return (
    <AppContext.Provider
      value={{
        posts,
        categories,
        siteSettings,
        addPost,
        updatePost,
        deletePost,
        getPostById,
        getPostBySlug,
        addCategory,
        updateCategory,
        deleteCategory, // Added deleteCategory
        getCategoryById,
        getCategoryBySlug,
        updateSiteSettings,
        isInitialDataLoaded,
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
