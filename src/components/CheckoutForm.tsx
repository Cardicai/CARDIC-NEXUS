'use client';

import { type ChangeEvent, type FormEvent, useState } from 'react';

import { dispatchReferralModalOpen } from '@/lib/events';

type PurchasePayload = {
  customerName: string;
  customerEmail: string;
  product: string;
  amountCents: number;
  referralCode?: string;
};

const DEFAULT_PRODUCT = 'Cardic Heat 2.0';
const DEFAULT_AMOUNT = 10_000;

export default function CheckoutForm() {
  const [form, setForm] = useState<PurchasePayload>({
    customerName: '',
    customerEmail: '',
    product: DEFAULT_PRODUCT,
    amountCents: DEFAULT_AMOUNT,
    referralCode: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange =
    (field: keyof PurchasePayload) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === 'amountCents'
          ? Number(event.target.value)
          : event.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: field === 'referralCode' ? value.toUpperCase() : value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const payload: PurchasePayload = {
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        product: form.product,
        amountCents: Number(form.amountCents),
      };

      if (form.referralCode?.trim()) {
        payload.referralCode = form.referralCode.trim().toUpperCase();
      }

      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? 'Unable to process purchase.');
      }

      setMessage('Payment recorded — welcome to the nexus.');
      setForm({
        customerName: '',
        customerEmail: '',
        product: DEFAULT_PRODUCT,
        amountCents: DEFAULT_AMOUNT,
        referralCode: '',
      });
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='w-full rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl shadow-cyan-500/10'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h3 className='text-xl font-semibold text-white'>Demo checkout</h3>
          <p className='text-sm text-slate-300'>
            Simulate a premium unlock with optional referral credit.
          </p>
        </div>
        <button
          type='button'
          onClick={dispatchReferralModalOpen}
          className='rounded-full border border-cyan-500/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200 transition hover:border-cyan-300 hover:text-white'
        >
          Need a code?
        </button>
      </div>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <label
              htmlFor='checkout-name'
              className='block text-xs uppercase tracking-wide text-slate-400'
            >
              Name
            </label>
            <input
              id='checkout-name'
              name='customerName'
              value={form.customerName}
              onChange={handleChange('customerName')}
              placeholder='Zara Vector'
              className='mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/40'
              required
            />
          </div>
          <div>
            <label
              htmlFor='checkout-email'
              className='block text-xs uppercase tracking-wide text-slate-400'
            >
              Email
            </label>
            <input
              id='checkout-email'
              type='email'
              name='customerEmail'
              value={form.customerEmail}
              onChange={handleChange('customerEmail')}
              placeholder='zara@cardicnexus.ai'
              className='mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/40'
              required
            />
          </div>
        </div>
        <div>
          <label
            htmlFor='checkout-product'
            className='block text-xs uppercase tracking-wide text-slate-400'
          >
            Product
          </label>
          <input
            id='checkout-product'
            name='product'
            value={form.product}
            onChange={handleChange('product')}
            className='mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/40'
            required
          />
        </div>
        <div>
          <label
            htmlFor='checkout-amount'
            className='block text-xs uppercase tracking-wide text-slate-400'
          >
            Amount (cents)
          </label>
          <input
            id='checkout-amount'
            name='amountCents'
            type='number'
            min={1000}
            step={100}
            value={form.amountCents}
            onChange={handleChange('amountCents')}
            className='mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/40'
            required
          />
        </div>
        <div>
          <label
            htmlFor='checkout-referral'
            className='block text-xs uppercase tracking-wide text-slate-400'
          >
            Referral code (optional)
          </label>
          <input
            id='checkout-referral'
            name='referralCode'
            value={form.referralCode ?? ''}
            onChange={handleChange('referralCode')}
            placeholder='NEX3267-ALE'
            className='mt-1 w-full rounded-xl border border-cyan-500/30 bg-black/40 px-4 py-3 text-sm tracking-[0.5em] text-cyan-200 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/40'
          />
        </div>
        {message ? (
          <p
            className={`text-sm ${
              message.startsWith('Payment')
                ? 'text-emerald-400'
                : 'text-rose-400'
            }`}
          >
            {message}
          </p>
        ) : null}
        <button
          type='submit'
          disabled={submitting}
          className='w-full rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-500 py-3 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60'
        >
          {submitting ? 'Processing…' : 'Complete checkout'}
        </button>
      </form>
    </div>
  );
}
