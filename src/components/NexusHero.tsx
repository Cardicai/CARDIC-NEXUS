'use client';

type NexusHeroProps = {
  exploreHref?: string;
  onFocusMenuClick?: () => void;
  onRedeemClick?: () => void;
  onJoinClick?: () => void;
};

export default function NexusHero({
  exploreHref = '#projects',
  onFocusMenuClick,
  onRedeemClick,
  onJoinClick,
}: NexusHeroProps) {
  return (
    <section className='relative isolate overflow-hidden bg-nexus-bg text-nexus-text'>
      {/* top stripe */}
      <div className='mx-auto max-w-6xl px-4 pt-8'>
        <div className='flex items-center justify-between'>
          <h6 className='text-sm tracking-[0.4em] text-white/90'>
            CARDIC NEXUS
          </h6>

          {/* teal focus button with cyan glow */}
          <button
            type='button'
            onClick={onFocusMenuClick}
            className='rounded-full border border-white/10 bg-nexus-teal/60 px-5 py-2 font-semibold text-white shadow-glowTeal backdrop-blur transition hover:bg-nexus-teal/70'
          >
            FOCUS MENU
          </button>
        </div>
      </div>

      {/* hero content */}
      <div className='mx-auto max-w-6xl px-4 pb-16 pt-10'>
        {/* stacked headline with gold/blue glow */}
        <h1 className='text-5xl font-extrabold leading-[1.05] md:text-6xl'>
          <span className='block text-nexus-gold text-glow-gold'>CARDIC</span>
          <span className='block text-nexus-blue text-glow-blue'>NEXUS</span>
        </h1>

        <p className='mt-4 text-lg text-nexus-sub'>
          AI • Trading • Innovation — for retail traders.
        </p>

        {/* action row */}
        <div className='mt-8 flex flex-wrap items-center gap-4'>
          {/* pills with gold outline */}
          <a
            className='rounded-2xl border border-nexus-goldDim/70 bg-transparent px-5 py-2 text-white/90 shadow-glowGold transition hover:bg-white/5'
            href={exploreHref}
          >
            Explore Projects
          </a>
          <button
            type='button'
            onClick={onRedeemClick}
            className='rounded-2xl border border-nexus-goldDim/70 bg-transparent px-5 py-2 text-white/90 shadow-glowGold transition hover:bg-white/5'
          >
            Redeem
          </button>

          {/* bright blue CTA */}
          <button
            type='button'
            onClick={onJoinClick}
            className='rounded-2xl bg-nexus-blue px-6 py-3 font-bold text-black shadow-glowBlue transition hover:brightness-110'
          >
            Join Premium
          </button>
        </div>

        {/* friendly footer line */}
        <p className='mt-8 text-base text-white/85'>
          💙 GOODLUCK ON YOUR TRADING JOURNEY — WE WANT TO SEE YOU WIN
        </p>
      </div>

      {/* soft vignette background */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(22,177,255,.12),transparent_60%),radial-gradient(900px_500px_at_80%_10%,rgba(241,179,76,.10),transparent_60%)]'
      />
    </section>
  );
}
