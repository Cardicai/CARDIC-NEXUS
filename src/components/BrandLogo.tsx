// src/components/BrandLogo.tsx
import Image from 'next/image';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE_MAP: Record<NonNullable<BrandLogoProps['size']>, { width: number; height: number }> = {
  sm: { width: 120, height: 36 },
  md: { width: 160, height: 48 },
  lg: { width: 200, height: 60 },
};

export default function BrandLogo({ size = 'md', className }: BrandLogoProps) {
  const s = SIZE_MAP[size];
  return (
    <Image
      src="/images/cardic-nexus-header.png"
      alt="CARDIC NEXUS"
      width={s.width}
      height={s.height}
      className={className}
      priority
    />
  );
}
