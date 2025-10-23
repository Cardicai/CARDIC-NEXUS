'use client';

import React from 'react';

type Props = {
  className?: string;
};

export default function RegistrationForm({ className = '' }: Props) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 ${className}`}
    >
      <h2 className='text-2xl font-bold md:text-3xl'>📘 Registration Form</h2>
      <p className='mt-2 text-white/70'>
        Provide the details below so we can confirm your spot. Email is required
        and will be tied to your tournament access.
      </p>

      <form className='mt-6 space-y-5' /* TODO: wire your submit handler */>
        <div>
          <label className='mb-1 block text-sm font-medium'>FULL NAME</label>
          <input
            className='w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none'
            placeholder='Your full name'
          />
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium'>EMAIL</label>
          <input
            type='email'
            className='w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none'
            placeholder='name@example.com'
          />
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium'>
            TELEGRAM @HANDLE
          </label>
          <input
            className='w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none'
            placeholder='@yourhandle'
          />
        </div>
        <div>
          <label className='mb-1 block text-sm font-medium'>COUNTRY</label>
          <select className='w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 outline-none'>
            <option value=''>Select your country</option>
            {/* TODO: country options */}
          </select>
        </div>

        {/* Submit button stays here if you already wired API */}
        <button
          type='submit'
          className='w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 py-3 font-semibold'
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
}
