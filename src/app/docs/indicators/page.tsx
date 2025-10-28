export const metadata = {
  title: 'Indicator Guides | Cardic Nexus',
  description:
    'Reference the official Cardic Nexus indicator documentation and setup briefs.',
};

const sections = [
  {
    title: 'Getting Started',
    body: 'Connect your TradingView account, confirm your Gmail address with the desk, and review the onboarding email for activation timelines.',
  },
  {
    title: 'Calibration Notes',
    body: 'Each indicator ships with recommended session profiles. Adjust the bias filters only after submitting calibration feedback to the admin desk.',
  },
  {
    title: 'Support Channels',
    body: 'Use the Trading Hub tickets or email the desk for urgent tweaks. All changes are mirrored to the admin dashboard for transparency.',
  },
];

export default function IndicatorDocsPage() {
  return (
    <div className='min-h-[calc(100vh-var(--nav-h))] bg-[#06040f] px-6 py-16 text-slate-100'>
      <div className='mx-auto flex max-w-4xl flex-col gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_45px_140px_rgba(8,12,24,0.65)]'>
        <header className='space-y-4 text-center'>
          <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
            Indicator Knowledge Base
          </p>
          <h1 className='text-3xl font-semibold text-white md:text-4xl'>
            Cardic Nexus Indicator Documentation
          </h1>
          <p className='text-sm leading-relaxed text-slate-300 md:text-base'>
            These briefs highlight the execution checklists, alert behaviour,
            and escalation steps for every Nexus Pulse module. Save the page and
            share it with your desk admin when requesting adjustments.
          </p>
        </header>

        <div className='space-y-6'>
          {sections.map((section) => (
            <section
              key={section.title}
              className='space-y-3 rounded-2xl border border-white/10 bg-black/40 p-6'
            >
              <h2 className='text-xl font-semibold text-white'>
                {section.title}
              </h2>
              <p className='text-sm leading-relaxed text-slate-300'>
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
