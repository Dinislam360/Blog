
import Link from 'next/link';
import Image from 'next/image';
import { Feather } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext'; // To get site settings
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  color?: string;
  isMobile?: boolean;
}

export function Logo({ className, iconSize = 28, textSize = 'text-2xl', color = 'text-primary', isMobile = false }: LogoProps) {
  const { siteSettings, isInitialDataLoaded } = useAppContext();

  const siteTitle = isInitialDataLoaded && siteSettings.siteTitle ? siteSettings.siteTitle : 'Apex Blogs';
  const logoUrl = isInitialDataLoaded ? siteSettings.logoUrl : undefined;

  return (
    <Link href="/" className={cn('flex items-center gap-2 font-bold', color, textSize, className)}>
      {logoUrl ? (
        <Image 
          src={logoUrl} 
          alt={`${siteTitle} logo`} 
          width={isMobile ? iconSize * 1.2 : iconSize * 1.5} // Adjust size as needed
          height={isMobile ? iconSize * 1.2 : iconSize * 1.5}
          className="rounded-sm"
          priority // Consider if logo is LCP
        />
      ) : (
        <Feather size={iconSize} strokeWidth={2.5} />
      )}
      {!isMobile && <span>{siteTitle}</span>}
      {isMobile && logoUrl && <span className="ml-1">{siteTitle}</span>} {/* Show title next to logo on mobile if image logo exists */}
      {isMobile && !logoUrl && <span>{siteTitle}</span>} {/* Show title if no image logo on mobile */}
    </Link>
  );
}
