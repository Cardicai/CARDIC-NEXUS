import Image from 'next/image';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE: Record<NonNullable<BrandLogoProps['size']>, number> = {
  sm: 40,
  md: 56,
  lg: 72,
};

export default function BrandLogo({ size = 'sm', className }: BrandLogoProps) {
  const px = SIZE[size];
  return (
    <Image
      src='/images/cardic-nexus-header.png'
      alt='CARDIC NEXUS'
      width={px}
      height={px}
      priority
      className={className}
      style={{
        borderRadius: '50%',
        objectFit: 'cover',
        background: 'transparent',
        boxShadow: '0 0 10px rgba(16,165,255,.35)',
      }}
    />
  );
}
