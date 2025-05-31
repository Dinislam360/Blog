
"use client";

import { useEffect } from 'react';
import Head from 'next/head';
import { useAppContext } from '@/contexts/AppContext';

export function SiteMetadata() {
  const { siteSettings, isInitialDataLoaded } = useAppContext();

  const defaultTitle = 'Apex Blogs - Your Content Hub';
  const defaultFavicon = '/favicon.ico';

  const pageTitle = isInitialDataLoaded && siteSettings.siteTitle ? siteSettings.siteTitle : defaultTitle;
  const faviconUrl = isInitialDataLoaded && siteSettings.faviconUrl ? siteSettings.faviconUrl : defaultFavicon;

  useEffect(() => {
    if (isInitialDataLoaded) {
      document.title = pageTitle;
      
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [pageTitle, faviconUrl, isInitialDataLoaded]);

  // This component doesn't render anything itself, it just manages head elements
  return null; 
}
