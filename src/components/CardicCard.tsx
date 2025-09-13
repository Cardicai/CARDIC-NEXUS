import React from 'react';

export default function CardicCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-brand-gold/40 bg-black/20 p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-gold ${className}`}
    >
      {children}
    </div>
  );
}
