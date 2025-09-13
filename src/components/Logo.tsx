// components/Logo.tsx
export default function Logo({ center = false }: { center?: boolean }) {
  return (
    <div className={`select-none ${center ? 'text-center' : 'text-left'}`}>
      <div className='font-extrabold tracking-wide leading-none'>
        <span className='text-gold-metallic'>CARDIC</span>{' '}
        <span className='text-blue-neon uppercase tracking-nexus'>NEXUS</span>
      </div>
      <div className='text-[10px] text-white/60 mt-0.5'>AI • TRADING</div>
    </div>
  );
}
