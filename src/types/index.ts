
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

export interface SiteSettings {
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
