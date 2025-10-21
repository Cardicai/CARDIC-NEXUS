'use client';

import { ExternalLink, RefreshCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const USERNAME = 'cardic';
// If FX Blue gives you a specific widget embed URL, paste it here instead:
const BASE_URL = `https://www.fxblue.com/users/${USERNAME}`;

const TABS = [
  { key: 'overview', label: 'Overview', path: '' }, // main page
  { key: 'analysis', label: 'Analysis', path: '#analysis' },
  { key: 'stats', label: 'Stats', path: '#stats' },
  { key: 'risk', label: 'Risk', path: '#risk' },
  { key: 'widgets', label: 'Widgets', path: '/widgets' }, // optional
];

export default function FxBluePage() {
  const [tab, setTab] = useState<string>(TABS[0].key);
  const [auto, setAuto] = useState<boolean>(true);
  const [reloadNonce, setReloadNonce] = useState<number>(0);

  // Build iframe URL for the selected tab
  const baseSrc =
    tab === 'overview'
      ? BASE_URL
      : `${BASE_URL}${TABS.find((t) => t.key === tab)?.path || ''}`;

  const src = useMemo(() => {
    const separator = baseSrc.includes('?') ? '&' : '?';
    return `${baseSrc}${separator}refresh=${reloadNonce}`;
  }, [baseSrc, reloadNonce]);

  // Auto-refresh every 60s when enabled
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setReloadNonce((nonce) => nonce + 1);
    }, 60_000);
    return () => clearInterval(id);
  }, [auto]);

  const handleManualRefresh = () => {
    setReloadNonce((nonce) => nonce + 1);
  };

  return (
    <div className='mx-auto w-full max-w-6xl p-4 md:p-6'>
      <Card className='rounded-2xl shadow-sm'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0'>
          <CardTitle className='text-xl md:text-2xl'>
            FX Blue — {USERNAME.toUpperCase()}
          </CardTitle>

          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={handleManualRefresh}>
              <RefreshCcw className='mr-2 h-4 w-4' />
              Refresh
            </Button>
            <a href={BASE_URL} target='_blank' rel='noreferrer'>
              <Button size='sm'>
                Open on FX Blue <ExternalLink className='ml-2 h-4 w-4' />
              </Button>
            </a>
          </div>
        </CardHeader>

        <CardContent className='space-y-3'>
          {/* Tabs */}
          <div className='flex flex-wrap gap-2'>
            {TABS.map((t) => (
              <Button
                key={t.key}
                variant={tab === t.key ? 'default' : 'outline'}
                size='sm'
                onClick={() => setTab(t.key)}
                className='rounded-full'
              >
                {t.label}
              </Button>
            ))}
            <label className='ml-auto flex items-center gap-2 text-sm'>
              <input
                type='checkbox'
                checked={auto}
                onChange={(e) => setAuto(e.target.checked)}
              />
              Auto-refresh (60s)
            </label>
          </div>

          {/* Responsive iframe container */}
          <div className='relative w-full overflow-hidden rounded-xl border'>
            <div className='absolute inset-0 -z-10 animate-pulse bg-muted/20' />
            <iframe
              title='FX Blue'
              src={src}
              className='h-[72vh] w-full'
              sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
              loading='lazy'
            />
          </div>

          <p className='text-xs text-muted-foreground'>
            If you see a blank panel, FX Blue may block generic embeds. Go to
            <span className='font-semibold'> FX Blue → Widgets</span>, copy your
            provided <span className='font-mono'>iframe</span> URL, and replace{' '}
            <span className='font-mono'>BASE_URL</span> above with that link.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
