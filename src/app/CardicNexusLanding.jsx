/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';

export default function CardicNexusLanding() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('/api/submit-payment', {
        method: 'POST',
        body: data,
      });
      if (res.ok) {
        alert('Payment proof submitted!');
        form.reset();
      } else {
        alert('Submission failed');
      }
    } catch (err) {
      alert('Submission failed');
    }
  };

  const placeholder =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';

  return (
    <main className='p-8 space-y-12 text-white bg-[#0a0f1c] min-h-screen'>
      <section id='socials' className='space-y-4'>
        <h2 className='text-2xl font-bold'>Follow our Social Pages</h2>
        <ul className='space-y-2'>
          <li>
            <a
              href='https://www.tiktok.com/@cardicnexus?_t=ZT-8zDvH2iUl01&_r=1'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:underline'
            >
              TikTok Global
            </a>
          </li>
          <li>
            <a
              href='https://www.instagram.com/cardicnexus?igsh=MXh3NGhxZXdpdDR0OQ=='
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:underline'
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              href='https://x.com/CARDICNEXUS?t=xpUNONAmekVrQBRXiQp36A&s=09'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 hover:underline'
            >
              X (Twitter)
            </a>
          </li>
        </ul>
      </section>

      <section id='pay' className='space-y-6'>
        <h2 className='text-2xl font-bold'>Crypto Payments Only</h2>
        <div className='space-y-2'>
          <p className='font-semibold'>USDT ERC20</p>
          <p className='break-all'>
            0x713598879a14D07013d3154b225D2fa838bb0a54
          </p>
          <img alt='USDT QR' className='w-48 h-48' src={placeholder} />
        </div>
        <div className='space-y-2'>
          <p className='font-semibold'>BTC</p>
          <p className='break-all'>
            bc1qm034jk98v7yzdy5yedyvwave96ujqjgnqyytm3
          </p>
          <img alt='BTC QR' className='w-48 h-48' src={placeholder} />
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='text-2xl font-bold'>Submit Payment Proof</h2>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
          method='POST'
          encType='multipart/form-data'
        >
          <input
            type='hidden'
            name='adminEmail'
            value='realcardic1@gmail.com'
          />
          <div>
            <label className='block'>Name</label>
            <input name='name' className='text-black p-2 w-full' />
          </div>
          <div>
            <label className='block'>Email*</label>
            <input
              name='email'
              type='email'
              required
              className='text-black p-2 w-full'
            />
          </div>
          <div>
            <label className='block'>Contact</label>
            <input name='contact' className='text-black p-2 w-full' />
          </div>
          <div>
            <label className='block'>Product Type*</label>
            <select
              name='productType'
              required
              className='text-black p-2 w-full'
            >
              <option value='signals'>Signals</option>
              <option value='bot'>Bot</option>
              <option value='heat50'>Heat 50</option>
              <option value='heat100'>Heat 100</option>
              <option value='heat150'>Heat 150</option>
            </select>
          </div>
          <div>
            <label className='block'>TradingView Username</label>
            <input name='tradingview' className='text-black p-2 w-full' />
          </div>
          <div>
            <label className='block'>Notes</label>
            <textarea name='notes' className='text-black p-2 w-full' />
          </div>
          <div>
            <label className='block'>Payment Proof*</label>
            <input
              name='proof'
              type='file'
              required
              className='text-black p-2 w-full'
            />
          </div>
          <button
            type='submit'
            className='bg-blue-600 px-4 py-2 rounded hover:bg-blue-500'
          >
            Submit
          </button>
        </form>
      </section>
    </main>
  );
}
