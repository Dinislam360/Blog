
"use client";

import { useEffect } from 'react';
import Head from 'next/head';
import { useAppContext } from '@/contexts/AppContext';

export function SiteMetadata() {
  const { siteSettings, isInitialDataLoaded } = useAppContext();

  const defaultTitle = 'Apex Blogs - Your Content Hub';
  const pageTitle = isInitialDataLoaded && siteSettings.siteTitle ? siteSettings.siteTitle : defaultTitle;

  // Helper function to manage injected HTML/script elements
  const manageInjectedHtml = (
    targetElement: HTMLElement,
    htmlString: string | undefined,
    elementId: string,
    elementType: string = 'div' // Use 'div' as a generic container
  ) => {
    if (typeof document === 'undefined') return; // Ensure document is available

    let container = document.getElementById(elementId);

    if (htmlString && htmlString.trim() !== '') {
      if (!container) {
        container = document.createElement(elementType);
        container.id = elementId;
        targetElement.appendChild(container);
      }
      // Scripts might not execute if just set via innerHTML directly in some cases,
      // but for generic code snippets (including style, meta, or simple divs), this is okay.
      // For robust script execution, one might need to parse script tags and recreate them.
      // However, for AdSense and typical custom codes, direct innerHTML is often sufficient or intended.
      if (container.innerHTML !== htmlString) { // Avoid unnecessary DOM manipulation
        container.innerHTML = htmlString;
      }
    } else {
      if (container) {
        targetElement.removeChild(container);
      }
    }
  };


  useEffect(() => {
    if (isInitialDataLoaded && typeof document !== 'undefined') {
      document.title = pageTitle;
      
      const head = document.head;
      const body = document.body;
      if (!head || !body) {
        console.warn("document.head or document.body not found when trying to set metadata.");
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
        // If faviconUrl is empty, rely on browser default or manually placed favicon.ico
        // Do not remove if it exists, as it might be a static one.
        // Only manage favicons that are dynamically set by this URL.
        // If you want to enforce removal, uncomment the next block.
        /*
        if (faviconLink && faviconLink.href.startsWith('blob:')) { // Or a more specific check if needed
          head.removeChild(faviconLink);
        }
        */
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
          if (tag.content !== content) {
            tag.content = content;
          }
        } else {
          if (existingTag) {
            head.removeChild(existingTag);
          }
        }
      };

      createOrUpdateMetaTag('google-site-verification', siteSettings.googleVerification);
      createOrUpdateMetaTag('msvalidate.01', siteSettings.bingVerification); 
      createOrUpdateMetaTag('p:domain_verify', siteSettings.pinterestVerification); 
      createOrUpdateMetaTag('yandex-verification', siteSettings.yandexVerification);

      // Inject AdSense and Custom Codes
      manageInjectedHtml(head, siteSettings.adSenseHeader, 'apex-adsense-header');
      manageInjectedHtml(head, siteSettings.customHeaderCode, 'apex-custom-header');
      manageInjectedHtml(body, siteSettings.adSenseFooter, 'apex-adsense-footer');
      manageInjectedHtml(body, siteSettings.customFooterCode, 'apex-custom-footer');

    }
  }, [pageTitle, siteSettings, isInitialDataLoaded]);

  return null; 
}
