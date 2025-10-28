'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import PaymentSheet, { type PaymentPlan } from '@/components/PaymentSheet';

export default function CheckoutPageClient({
  plan,
}: {
  plan: PaymentPlan | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(true);
  }, [plan?.id]);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.close();
    }

    setOpen(false);
    router.push('/indicators');
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#02030b] text-slate-100'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_14%_12%,rgba(245,199,107,0.2),transparent_58%),radial-gradient(circle_at_82%_8%,rgba(56,189,248,0.26),transparent_60%),radial-gradient(circle_at_50%_88%,rgba(99,102,241,0.22),transparent_65%)]' />
      <PaymentSheet open={open} onClose={handleClose} plan={plan} />
      {!open ? (
        <div className='mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 px-6 text-center'>
          <h1 className='text-3xl font-semibold text-white'>Redirecting…</h1>
          <p className='text-sm text-slate-300'>
            Hang tight while we send you back to the indicators page.
          </p>
        </div>
      ) : null}
    </div>
  );
}
