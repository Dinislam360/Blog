
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  dataAiHint?: string; // For placeholder image generation context
  categoryId: string;
  seoKeywords: string; // Comma-separated
  seoDescription: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string; // Optional: for future icon mapping
}

export interface SiteSettings {
  siteTitle?: string;
  logoUrl?: string;
  faviconUrl?: string; // URL for the favicon
  adminSidebarLogoColor?: string; // Tailwind CSS class for admin sidebar logo color
  footerCopyright?: string;
  // footerTagline?: string; // Removed as per previous request
  socialLinks?: SocialLink[];
  adSenseHeader?: string;
  adSenseFooter?: string;
  adSenseSidebar?: string;
  customHeaderCode?: string;
  customFooterCode?: string;
  googleVerification?: string;
  bingVerification?: string;
  pinterestVerification?: string;
  yandexVerification?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
  disabled?: boolean;
}
