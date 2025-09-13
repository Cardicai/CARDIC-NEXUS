import { Send, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function SocialRow() {
  const items = [
    { href: 'https://t.me', icon: Send, label: 'Telegram' },
    { href: 'https://twitter.com', icon: Twitter, label: 'X' },
    { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
  ];
  return (
    <div className='flex gap-4'>
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          aria-label={item.label}
          className='hover:text-brand-blue'
        >
          <item.icon />
        </Link>
      ))}
    </div>
  );
}
