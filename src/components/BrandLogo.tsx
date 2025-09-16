import Image from 'next/image';

type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE_MAP: Record<
  NonNullable<BrandLogoProps['size']>,
  { width: number; height: number }
> = {
  sm: { width: 100, height: 100 },
  md: { width: 140, height: 140 },
  lg: { width: 200, height: 200 },
};

export default function BrandLogo({ size = 'sm', className }: BrandLogoProps) {
  const s = SIZE_MAP[size];
  return (
    <Image
      src='/images/cardic-nexus-header.png'
      alt='CARDIC NEXUS'
      width={s.width}
      height={s.height}
      className={className}
      priority
    />
  );
}
