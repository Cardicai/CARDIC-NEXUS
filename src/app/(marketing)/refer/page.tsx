import CheckoutForm from '@/components/CheckoutForm';
import ReferCTAButton from '@/components/ReferCTAButton';

export const metadata = {
  title: 'Refer & Earn — CARDIC NEXUS',
  description:
    'Earn 35% recurring commission by sharing Cardic Nexus with your network. Mint your referral code and send traders through a premium checkout experience.',
};

export default function ReferPage() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-black to-slate-950 pb-24 pt-16 text-white'>
      <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_55%)]' />
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 lg:flex-row lg:items-start'>
        <div className='max-w-2xl space-y-6 pt-6'>
          <span className='inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200'>
            Earn 35% forever
          </span>
          <h1 className='text-4xl font-bold tracking-tight text-white sm:text-5xl'>
            Share the Cardic Nexus edge and collect elite residuals
          </h1>
          <p className='text-lg text-slate-300'>
            Unlock a premium partner lane crafted for quant-forward creators,
            trading mentors, and fintech communities. Every referral you send
            unlocks a 35% revenue share for the lifetime of their subscription.
          </p>
          <ul className='space-y-3 text-sm text-slate-300'>
            <li className='flex items-start gap-3'>
              <span className='mt-1 h-2 w-2 rounded-full bg-cyan-400' />
              Instant referral code generation with pro-grade tracking.
            </li>
            <li className='flex items-start gap-3'>
              <span className='mt-1 h-2 w-2 rounded-full bg-indigo-400' />
              Canvas confetti drop to celebrate every new ambassador.
            </li>
            <li className='flex items-start gap-3'>
              <span className='mt-1 h-2 w-2 rounded-full bg-violet-400' />
              Live checkout sandbox to prove the flow before you blast your
              list.
            </li>
          </ul>
          <div className='flex flex-wrap items-center gap-4 pt-4'>
            <ReferCTAButton>Mint my referral code</ReferCTAButton>
            <a
              href='mailto:partners@cardicnexus.ai'
              className='text-sm text-slate-300 transition hover:text-white hover:underline'
            >
              Talk to partnerships →
            </a>
          </div>
        </div>
        <div className='flex-1'>
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}
