// components/ui.tsx
export function BtnBlue(props: React.ComponentProps<'a'>) {
  return (
    <a
      {...props}
      className={`rounded-xl px-4 py-2 font-semibold text-black bg-brand-blue drop-shadow-blue ${
        props.className || ''
      }`}
    />
  );
}
export function BtnGoldOutline(props: React.ComponentProps<'a'>) {
  return (
    <a
      {...props}
      className={`rounded-xl px-4 py-2 border border-[rgba(245,199,107,.45)] text-white/90 hover:bg-white/10 ${
        props.className || ''
      }`}
    />
  );
}
