// components/CardicCard.tsx
import { ReactNode } from 'react';

export default function CardicCard({ children }: { children: ReactNode }) {
  return (
    <div className='rounded-xl bg-white/5 border border-white/10 shadow-goldThin hover:border-[rgba(245,199,107,.55)] transition'>
      <div className='p-4'>{children}</div>
    </div>
  );
}
