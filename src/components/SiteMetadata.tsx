
"use client";

import { useEffect } from 'react';
import Head from 'next/head';
import { useAppContext } from '@/contexts/AppContext';

export function SiteMetadata() {
  const { siteSettings, isInitialDataLoaded } = useAppContext();

  const defaultTitle = 'Apex Blogs - Your Content Hub';
  const pageTitle = isInitialDataLoaded && siteSettings.siteTitle ? siteSettings.siteTitle : defaultTitle;

  useEffect(() => {
    if (isInitialDataLoaded) {
      document.title = pageTitle;
      
      const head = document.head;
      if (!head) {
        console.warn("document.head not found when trying to set metadata.");
        return;
      }

      // Favicon Management
      const currentFaviconUrl = siteSettings.faviconUrl;
      let faviconLink: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");

      if (currentFaviconUrl && currentFaviconUrl.trim() !== '') {
        if (!faviconLink) {
          faviconLink = document.createElement('link');
          faviconLink.rel = 'icon';
          head.appendChild(faviconLink);
        }
        if (faviconLink.href !== currentFaviconUrl) {
            faviconLink.href = currentFaviconUrl;
        }
      } else {
        if (faviconLink) {
          head.removeChild(faviconLink);
        }
      }

      // Site Verification Meta Tags Management
      const createOrUpdateMetaTag = (name: string, content?: string) => {
        const existingTag = head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
        
        if (content && content.trim() !== '') {
          let tag = existingTag;
          if (!tag) {
            tag = document.createElement('meta');
            tag.name = name;
            head.appendChild(tag);
          }
          tag.content = content;
        } else {
          // If content is empty or undefined, remove the tag if it exists
          if (existingTag) {
            head.removeChild(existingTag);
          }
        }
      };

      createOrUpdateMetaTag('google-site-verification', siteSettings.googleVerification);
      createOrUpdateMetaTag('msvalidate.01', siteSettings.bingVerification); // Common name for Bing
      createOrUpdateMetaTag('p:domain_verify', siteSettings.pinterestVerification); // Common name for Pinterest
      createOrUpdateMetaTag('yandex-verification', siteSettings.yandexVerification);

      // Handling for AdSense Header and Custom Header Code
      // These are injected via _document.tsx or a custom App component in a real setup,
      // or by directly manipulating the head if absolutely necessary for client-side rendering.
      // For simplicity, if customHeaderCode or adSenseHeader are defined, we'll append them.
      // This simple append might lead to duplicates if settings change without a page reload.
      // A more robust solution would involve IDs or markers to manage these script blocks.

      // Note: The AdSense and Custom Code injection logic previously here was simplified.
      // The current PRD asks for tools to *insert* them, which the SettingsForm provides.
      // Automatic injection of arbitrary script tags here is complex to manage idempotently.
      // This component will focus on title, favicon, and specific meta tags.
      // Arbitrary script injection is better handled by a different mechanism if required dynamically,
      // or often placed directly in _document.js or layout components for scripts needed on every page.

    }
  }, [pageTitle, siteSettings, isInitialDataLoaded]);

  // This component doesn't render anything itself, it just manages head elements
  return null; 
}
