'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

type TabKey = 'overview' | 'analysis' | 'stats' | 'risk' | 'widgets';

const USERNAME = 'cardic';
const DEFAULT_URL = `https://www.fxblue.com/users/${USERNAME}`;

export default function FxBlueWidget() {
  const [tab, setTab] = useState<TabKey>('overview');
  const [auto, setAuto] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const baseUrl =
    (typeof window !== 'undefined' &&
      (process.env.NEXT_PUBLIC_FXBLUE_EMBED_URL || '')) ||
    DEFAULT_URL;

  const src = useMemo(() => {
    switch (tab) {
      case 'overview':
        return baseUrl;
      case 'analysis':
        return `${baseUrl}#analysis`;
      case 'stats':
        return `${baseUrl}#stats`;
      case 'risk':
        return `${baseUrl}#risk`;
      case 'widgets':
        return `${baseUrl}/widgets`;
      default:
        return baseUrl;
    }
  }, [tab, baseUrl]);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      iframeRef.current?.contentWindow?.location.reload();
    }, 60_000);
    return () => clearInterval(id);
  }, [auto]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'analysis', label: 'Analysis' },
    { key: 'stats', label: 'Stats' },
    { key: 'risk', label: 'Risk' },
    { key: 'widgets', label: 'Widgets' },
  ];

  return (
    <main className='mx-auto w-full max-w-6xl p-4 md:p-6'>
      <div className='mb-4 flex flex-wrap items-center gap-2'>
        <h1 className='text-xl font-semibold md:text-2xl'>
          FX Blue — {USERNAME.toUpperCase()}
        </h1>
        <div className='ml-auto flex items-center gap-2'>
          <button
            onClick={() => {
              iframeRef.current?.contentWindow?.location.reload();
            }}
            className='rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50'
            aria-label='Manual refresh'
          >
            Refresh
          </button>
          <a
            href={baseUrl}
            target='_blank'
            rel='noreferrer'
            className='rounded-md bg-black px-3 py-1.5 text-sm text-white hover:opacity-90'
          >
            Open on FX Blue
          </a>
        </div>
      </div>

      <div className='mb-3 flex flex-wrap items-center gap-2'>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              tab === t.key
                ? 'bg-black text-white'
                : 'border bg-white text-black hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
        <label className='ml-auto flex cursor-pointer select-none items-center gap-2 text-sm'>
          <input
            type='checkbox'
            checked={auto}
            onChange={(e) => setAuto(e.target.checked)}
          />
          Auto-refresh (60s)
        </label>
      </div>

      <div className='relative w-full overflow-hidden rounded-xl border'>
        <iframe
          ref={iframeRef}
          title='FX Blue'
          src={src}
          className='h-[72vh] w-full'
          sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
          loading='lazy'
        />
      </div>

      <p className='mt-2 text-xs text-gray-500'>
        If this panel is blank, FX Blue may block generic embeds. Go to your FX
        Blue <b>Widgets</b> page, copy the provided embed URL, and set it in
        <code className='mx-1 rounded bg-gray-100 px-1'>
          NEXT_PUBLIC_FXBLUE_EMBED_URL
        </code>
        .
      </p>
    </main>
  );
}
