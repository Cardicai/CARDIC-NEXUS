export default function Badge({ text }: { text: string }) {
  return (
    <span className='rounded bg-brand-gold/20 px-2 py-0.5 text-xs text-brand-gold'>
      {text}
    </span>
  );
}
