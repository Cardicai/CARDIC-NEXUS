'use client';
import { useEffect, useState } from 'react';

export default function EmailWarning() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    fetch('/api/email/status')
      .then((r) => r.json())
      .then((j) => setHidden(!!j?.verified))
      .catch(() => setHidden(false));
  }, []);
  if (hidden) return null;

  return (
    <div className='rounded-xl border border-yellow-600/40 bg-yellow-500/10 text-yellow-200 p-3'>
      <div className='font-medium'>Email sending limited</div>
      <div className='text-sm opacity-90'>
        You can only send test emails to your inbox until domain verification is
        complete.
      </div>
    </div>
  );
}
