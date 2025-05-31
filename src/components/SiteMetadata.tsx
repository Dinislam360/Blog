
"use client";

import { useEffect } from 'react';
import Head from 'next/head';
import { useAppContext } from '@/contexts/AppContext';

export function SiteMetadata() {
  const { siteSettings, isInitialDataLoaded } = useAppContext();

  const defaultTitle = 'Apex Blogs - Your Content Hub';
  // Removed defaultFavicon constant

  const pageTitle = isInitialDataLoaded && siteSettings.siteTitle ? siteSettings.siteTitle : defaultTitle;
  // faviconUrl will now be taken directly from siteSettings.faviconUrl

  useEffect(() => {
    if (isInitialDataLoaded) {
      document.title = pageTitle;
      
      const currentFaviconUrl = siteSettings.faviconUrl;
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");

      if (currentFaviconUrl && currentFaviconUrl.trim() !== '') {
        // If a favicon URL is set in settings and is not empty
        if (!link) {
          // If no link element exists, create and append it
          link = document.createElement('link');
          link.rel = 'icon';
          if (document.head) {
            document.head.appendChild(link);
          } else {
            console.warn("document.head not found when trying to set favicon.");
            return; // Cannot proceed without document.head
          }
        }
        // Ensure link exists (it should, either found or created) before setting href
        if (link && link.href !== currentFaviconUrl) {
            link.href = currentFaviconUrl;
        }
      } else {
        // If no favicon URL is set in settings (or it's an empty string),
        // remove any existing favicon link that might have been added by this component.
        if (link && document.head) {
          document.head.removeChild(link);
        }
      }
    }
  }, [pageTitle, siteSettings.faviconUrl, isInitialDataLoaded]);

  // This component doesn't render anything itself, it just manages head elements
  return null; 
}
