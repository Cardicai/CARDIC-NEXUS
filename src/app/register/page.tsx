import type { Metadata } from 'next';

import RegistrationForm from '@/components/RegistrationForm';

export const metadata: Metadata = {
  title: 'Register • Cardic Nexus',
  description: 'Secure your tournament slot.',
  robots: { index: true, follow: true },
};

export default function RegisterPage() {
  return (
    <main className='min-h-[100svh] bg-gradient-to-b from-black to-[#020617] text-white'>
      <div className='mx-auto max-w-3xl px-4 py-10 md:py-16'>
        <RegistrationForm />
      </div>
    </main>
  );
}
