export const metadata = {
  title: 'Cardic Nexus Tournament Dashboard',
};

export default function TournamentDashboardPage() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950 text-slate-100'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#1f293b_0%,rgba(15,23,42,0.75)_55%,rgba(10,12,16,0.95)_100%)]' />
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.18),transparent_60%)]' />
      <div className='relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-24 text-center sm:px-8'>
        <span className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80 backdrop-blur-sm'>
          Cardic Nexus Tournament
        </span>
        <h1 className='mt-6 text-4xl font-bold text-white sm:text-5xl'>
          Dashboard
        </h1>
        <p className='mt-5 text-lg text-slate-300 sm:text-xl'>
          Welcome to the Cardic Tournament Dashboard. Your trading stats will
          appear here soon.
        </p>
        <p className='mt-8 max-w-xl text-sm text-slate-400 sm:text-base'>
          We&apos;re currently onboarding competitors and connecting live
          performance feeds. Keep this page bookmarked — once your account is
          provisioned we&apos;ll notify you via email with secure access
          details.
        </p>
      </div>
    </div>
  );
}
