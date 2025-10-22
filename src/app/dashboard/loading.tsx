const loadingStats = [
  {
    label: 'ROI Sync',
    value: '+12.8%',
    tone: 'text-emerald-300',
    detail: 'Calibrating top-line performance metrics',
  },
  {
    label: 'Drawdown Check',
    value: '4.6%',
    tone: 'text-sky-300',
    detail: 'Verifying risk guardrails are holding',
  },
  {
    label: 'Status Audit',
    value: 'ACTIVE',
    tone: 'text-amber-200',
    detail: 'Confirming competitor standings',
  },
  {
    label: 'Elimination Timer',
    value: '03:18:42',
    tone: 'text-purple-200',
    detail: 'Syncing next elimination window',
  },
];

export default function DashboardLoading() {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.25),transparent_55%),_radial-gradient(circle_at_75%_10%,rgba(129,140,248,0.3),transparent_55%),_radial-gradient(circle_at_50%_80%,rgba(250,204,21,0.22),transparent_55%)]' />
      <div className='flex flex-col items-center gap-8 rounded-3xl border border-white/10 bg-white/5 px-10 py-12 text-center shadow-xl shadow-blue-950/40 backdrop-blur'>
        <div className='relative h-16 w-16'>
          <div className='absolute inset-0 animate-[spin_1.8s_linear_infinite] rounded-full border-4 border-transparent border-t-cyan-300 border-b-purple-400' />
          <div className='absolute inset-3 rounded-full bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-amber-400/30 shadow-inner shadow-black/60' />
        </div>
        <div className='space-y-3'>
          <p className='text-sm font-semibold uppercase tracking-[0.35em] text-cyan-100'>
            Preparing dashboard
          </p>
          <h2 className='text-2xl font-bold text-white'>
            Loading tournament intelligence…
          </h2>
          <p className='max-w-md text-sm text-slate-200/80'>
            Hold tight while we sync the latest leaderboard insights, risk
            monitors, and elimination schedule.
          </p>
        </div>
        <div className='grid w-full gap-4 text-left sm:grid-cols-2'>
          {loadingStats.map((item) => (
            <div
              key={item.label}
              className='rounded-2xl border border-white/10 bg-black/30 p-4 shadow-inner shadow-black/60 backdrop-blur'
            >
              <p className='text-xs font-semibold uppercase tracking-[0.25em] text-slate-200/60'>
                {item.label}
              </p>
              <p className={`mt-2 text-2xl font-black ${item.tone}`}>
                {item.value}
              </p>
              <p className='mt-2 text-xs text-slate-200/70'>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
