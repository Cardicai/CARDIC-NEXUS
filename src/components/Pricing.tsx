import { Check } from 'lucide-react';
import Link from 'next/link';

import { plans } from '@/data/pricing';

const cardBaseClasses =
  'group relative overflow-hidden rounded-2xl bg-[#0A0B10] shadow-[0_0_0_1px_rgba(214,164,68,0.15)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(43,167,255,0.35),0_6px_40px_rgba(43,167,255,0.12)]';

export default function Pricing() {
  return (
    <section className='relative overflow-hidden bg-[#050507]'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(43,167,255,0.08),rgba(5,5,7,0)_70%)]'
      />

      <div className='relative mx-auto max-w-screen-xl px-4 py-20 sm:px-6 lg:px-8'>
        <div className='mx-auto flex max-w-2xl flex-col items-center text-center'>
          <span className='mb-4 inline-flex items-center rounded-full border border-[#2BA7FF]/30 bg-[#2BA7FF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#A8AFBF]'>
            Cardic Plans
          </span>
          <h2 className='text-3xl font-extrabold tracking-tight text-[#E6E8EE] sm:text-4xl'>
            Pricing
          </h2>
          <p className='mt-3 text-base text-[#A8AFBF] sm:text-lg'>
            Choose a plan that powers your edge.
          </p>
        </div>

        <div className='mx-auto mt-12 max-w-3xl'>
          <article
            className={`${cardBaseClasses} border border-[#2BA7FF]/35 bg-[#0A0B10]/95 shadow-[0_0_0_1px_rgba(214,164,68,0.35)]`}
          >
            <div className='p-8 sm:p-10'>
              <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <h3 className='text-2xl font-semibold tracking-tight text-[#E6E8EE] sm:text-3xl'>
                    {plans.featured.title}
                  </h3>
                  <p className='mt-3 inline-flex items-baseline text-4xl font-black tracking-tight text-[#E6E8EE] sm:text-5xl'>
                    <span className='bg-gradient-to-r from-[#2BA7FF] via-[#5BD8FF] to-[#2BA7FF] bg-clip-text text-transparent'>
                      {plans.featured.price}
                    </span>
                  </p>
                </div>
                <Link
                  aria-label={plans.featured.cta.label}
                  href={plans.featured.cta.href}
                  className='inline-flex items-center justify-center rounded-xl bg-[#2BA7FF] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA7FF]/40'
                >
                  {plans.featured.cta.label}
                </Link>
              </div>
              <div className='mt-8 space-y-4'>
                {plans.featured.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className='flex items-start gap-3 text-sm text-[#A8AFBF] sm:text-base'
                  >
                    <Check
                      className='mt-0.5 h-5 w-5 flex-shrink-0 text-[#2BA7FF]'
                      aria-hidden
                    />
                    <span className='text-[#E6E8EE]'>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-px w-full bg-[rgba(214,164,68,0.25)]' />
            <div
              className='bg-gradient-to-r from-transparent via-[#2BA7FF]/10 to-transparent py-4'
              aria-hidden
            />
          </article>
        </div>

        <div className='mt-16 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3'>
          {plans.standalone.map((plan) => (
            <article key={plan.title} className={cardBaseClasses}>
              <div className='flex h-full flex-col p-8'>
                <div className='flex-1'>
                  <h3 className='text-xl font-semibold tracking-tight text-[#E6E8EE]'>
                    {plan.title}
                  </h3>
                  <p className='mt-2 text-sm text-[#A8AFBF]'>{plan.desc}</p>
                  <div className='mt-6 text-2xl font-bold tracking-tight text-[#E6E8EE]'>
                    {plan.price}
                  </div>
                </div>
                <div className='my-8 h-px bg-[rgba(214,164,68,0.25)]' />
                <Link
                  aria-label={plan.cta.label}
                  href={plan.cta.href}
                  className='inline-flex items-center justify-center rounded-xl border border-[#2BA7FF]/40 px-5 py-3 text-sm font-semibold text-[#E6E8EE] transition hover:border-[#2BA7FF]/60 hover:bg-[#2BA7FF]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA7FF]/40'
                >
                  {plan.cta.label}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className='mt-16 space-y-4'>
          <div className='text-xs uppercase tracking-[0.24em] text-[#A8AFBF]'>
            Upcoming
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {plans.upcoming.map((item) => (
              <div
                key={item.title}
                className='flex items-center justify-between rounded-2xl border border-[#2BA7FF]/15 bg-[#0A0B10] px-5 py-4 text-sm text-[#E6E8EE]'
              >
                <span className='font-medium'>{item.title}</span>
                <span className='text-xs uppercase tracking-[0.2em] text-[#2BA7FF]'>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
