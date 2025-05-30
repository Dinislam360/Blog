
import Link from 'next/link';
import { Feather } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  color?: string;
  isMobile?: boolean;
}

export function Logo({ className, iconSize = 28, textSize = 'text-2xl', color = 'text-primary', isMobile = false }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 font-bold', color, textSize, className)}>
      <Feather size={iconSize} strokeWidth={2.5} />
      {!isMobile && <span>Apex Blogs</span>}
    </Link>
  );
}

// Helper for cn if not globally available in this file context
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');
