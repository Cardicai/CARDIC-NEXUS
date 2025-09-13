'use client';

import * as React from 'react';

export default function PricingPage() {
  // Send the user to the payment form on Home and preselect the product
  const goPay = (label: string) => {
    if (typeof window !== 'undefined') {
      const win = window as Window & {
        setSelectedProduct?: (value: string) => void;
      };
      if (win.setSelectedProduct) {
        win.setSelectedProduct(label);
        sessionStorage.setItem('cnx_product', label);
      }
      win.location.href = '/#pay';
    }
  };

  const Card = (p: { children: React.ReactNode }) => (
    <article className='rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_0_1px_rgba(245,199,107,.35),0_0_24px_rgba(245,199,107,.15)] p-5'>
      {p.children}
    </article>
  );

  const BtnBlue = (p: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      {...p}
      className={`rounded-xl px-4 py-2 font-semibold text-black bg-[#10A5FF] shadow-[0_0_12px_rgba(16,165,255,.45)] ${
        p.className || ''
      }`}
    />
  );
  const BtnOutline = (p: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      {...p}
      className={`rounded-xl px-4 py-2 border border-white/15 text-white/90 hover:bg-white/10 ${
        p.className || ''
      }`}
    />
  );

  return (
    <main className='mx-auto max-w-7xl px-4 py-10'>
      <h1 className='text-3xl font-extrabold mb-6'>Pricing</h1>

      {/* Premium (Join Premium) */}
      <section id='premium' className='mb-8'>
        <h2 className='text-xl font-semibold mb-3'>Join Premium</h2>
        <Card>
          <h3 className='text-lg font-semibold'>Premium Signals</h3>
          <div className='text-[#10A5FF] font-extrabold text-xl mt-1'>
            $49<span className='text-white/70 text-base'>/mo</span>
          </div>
          <ul className='mt-3 list-disc pl-5 text-white/70'>
            <li>Daily gold/FX/crypto signals</li>
            <li>Risk management notes</li>
            <li>Telegram access</li>
          </ul>
          <div className='mt-4 flex gap-3'>
            <BtnBlue onClick={() => goPay('Membership — Premium Signals')}>
              Join Premium
            </BtnBlue>
            <BtnOutline onClick={() => (location.href = '/#socials')}>
              Ask on Socials
            </BtnOutline>
          </div>
        </Card>
      </section>

      {/* Indicators (with CARDIC Heat tiers) */}
      <section id='indicators' className='mb-8'>
        <h2 className='text-xl font-semibold mb-3'>Indicators</h2>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <div className='text-xs inline-block border border-white/15 px-2 py-0.5 rounded-full mb-2'>
              Stable Release
            </div>
            <h3 className='text-lg font-semibold'>CARDIC Heat 2.0</h3>
            <div className='text-[#10A5FF] font-extrabold text-xl mt-1'>
              $25<span className='text-white/70 text-base'> / 2 months</span>
            </div>
            <ul className='mt-3 list-disc pl-5 text-white/70'>
              <li>Core liquidity zones + sentiment</li>
              <li>Standard signal set</li>
            </ul>
            <div className='mt-4'>
              <BtnBlue onClick={() => goPay('Indicator — CARDIC Heat 2.0')}>
                Get Access
              </BtnBlue>
            </div>
          </Card>

          <Card>
            <div className='text-xs inline-block border border-[rgba(16,165,255,.5)] bg-[rgba(16,165,255,.08)] px-2 py-0.5 rounded-full mb-2'>
              Enhanced
            </div>
            <h3 className='text-lg font-semibold'>CARDIC Heat 2.1</h3>
            <div className='text-[#10A5FF] font-extrabold text-xl mt-1'>
              $35<span className='text-white/70 text-base'> / 2 months</span>
            </div>
            <ul className='mt-3 list-disc pl-5 text-white/70'>
              <li>Improved dynamic zones + filters</li>
              <li>Expanded signal set</li>
            </ul>
            <div className='mt-4'>
              <BtnBlue onClick={() => goPay('Indicator — CARDIC Heat 2.1')}>
                Get Access
              </BtnBlue>
            </div>
          </Card>

          <Card>
            <div className='text-xs inline-block border border-[rgba(245,199,107,.55)] bg-[rgba(245,199,107,.10)] px-2 py-0.5 rounded-full mb-2'>
              Early Access 🚀
            </div>
            <h3 className='text-lg font-semibold'>CARDIC Heat 2.3</h3>
            <div className='text-[#10A5FF] font-extrabold text-xl mt-1'>
              $50<span className='text-white/70 text-base'> / 1 month</span>
            </div>
            <ul className='mt-3 list-disc pl-5 text-white/70'>
              <li>Not officially released yet</li>
              <li>Most acute & dynamic signals</li>
            </ul>
            <div className='mt-4'>
              <BtnBlue
                onClick={() =>
                  goPay('Indicator — CARDIC Heat 2.3 (Early Access)')
                }
              >
                Get Early Access
              </BtnBlue>
            </div>
          </Card>
        </div>

        {/* Other indicators shown as examples; wire later */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4'>
          <Card>
            <h3 className='text-lg font-semibold'>Cardic Heat Zones™</h3>
            <p className='text-white/70 mt-1'>Smart money zones with alerts.</p>
            <div className='mt-3'>
              <BtnOutline onClick={() => goPay('Indicator — Heat Zones')}>
                Buy
              </BtnOutline>
            </div>
          </Card>
          <Card>
            <h3 className='text-lg font-semibold'>Cardic Spider Web™</h3>
            <p className='text-white/70 mt-1'>
              Dynamic SR + Fibonacci + Order Blocks.
            </p>
            <div className='mt-3'>
              <BtnOutline onClick={() => goPay('Indicator — Spider Web')}>
                Buy
              </BtnOutline>
            </div>
          </Card>
          <Card>
            <h3 className='text-lg font-semibold'>CARDIC Oracle 1.0</h3>
            <p className='text-white/70 mt-1'>
              Real-time psychology, liquidity battles, predictive zones.
            </p>
            <div className='mt-3'>
              <BtnOutline
                onClick={() => goPay('Indicator — Oracle 1.0 (Soon)')}
              >
                Join Waitlist
              </BtnOutline>
            </div>
          </Card>
        </div>
      </section>

      {/* All-Access bundle */}
      <section id='all-access' className='mb-8'>
        <h2 className='text-xl font-semibold mb-3'>All-Access</h2>
        <Card>
          <h3 className='text-lg font-semibold'>All-Access Membership</h3>
          <div className='text-[#10A5FF] font-extrabold text-xl mt-1'>
            $179<span className='text-white/70 text-base'>/mo</span>
          </div>
          <ul className='mt-3 list-disc pl-5 text-white/70'>
            <li>All indicators</li>
            <li>Premium signals</li>
            <li>Priority support</li>
          </ul>
          <div className='mt-4'>
            <BtnBlue onClick={() => goPay('Membership — All-Access')}>
              Get All-Access
            </BtnBlue>
          </div>
        </Card>
      </section>

      {/* EAs & Algos */}
      <section id='eas' className='mb-10'>
        <h2 className='text-xl font-semibold mb-3'>EAs & Algos</h2>
        <Card>
          <h3 className='text-lg font-semibold'>Custom EA / Automation</h3>
          <p className='text-white/70 mt-1'>
            We build tailored MetaTrader EAs and automation. Provide your
            WhatsApp/Telegram contact and specs on the payment form.
          </p>
          <div className='mt-4 flex gap-3'>
            <BtnOutline onClick={() => goPay('EA — Custom Build (Quote)')}>
              Request Build (Quote)
            </BtnOutline>
            <BtnBlue onClick={() => (window.location.href = '/#socials')}>
              Chat First
            </BtnBlue>
          </div>
        </Card>
      </section>

      <div className='text-center text-white/70'>
        Ready to pay?{' '}
        <a className='underline' href='/#pay'>
          Open the Crypto Checkout
        </a>
      </div>
    </main>
  );
}
