'use client';

import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function CnGptChat() {
  // Open by default so it’s visible immediately
  const [open, setOpen] = useState(true);

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'assistant',
      content: '<b>cngpt</b>: I’m ready. Ask me about any symbol or timeframe.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function mdToHTML(s: string) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.+?)\*/g, '<i>$1</i>');
  }

  async function sendMessage(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: 'user', content: mdToHTML(text) };
    const draft: Msg = { role: 'assistant', content: '' };
    setMessages((m) => [...m, userMsg, draft]);
    setInput('');
    setLoading(true);

    // Mock reply (UI-only)
    setTimeout(() => {
      const reply =
        '<b>cngpt</b>: Noted. (UI-only) Your message is received clearly.';
      setMessages((m) => {
        const last = m[m.length - 1];
        if (!last || last.role !== 'assistant') return m;
        const updated = [...m];
        updated[updated.length - 1] = { ...last, content: reply };
        return updated;
      });
      setLoading(false);
    }, 350);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className='fixed bottom-6 right-6 z-[100] rounded-full shadow-xl px-4 py-3 bg-cyan-500/90 text-black font-semibold backdrop-blur hover:scale-105 transition'
        aria-label='Open cngpt'
      >
        {open ? 'Close' : 'Ask cngpt'}
      </button>

      {open && (
        <div className='fixed bottom-24 right-6 z-[100] w-[min(92vw,600px)] rounded-2xl shadow-2xl bg-neutral-950/95 border border-cyan-600/40 overflow-hidden backdrop-blur'>
          <div className='px-5 py-3 border-b border-cyan-800'>
            <div className='text-cyan-400 font-bold tracking-wide'>
              cngpt · Cardic Nexus
            </div>
            <div className='text-[12px] text-neutral-400'>
              UI mode • user → right · cngpt → left
            </div>
          </div>

          {/* Messages */}
          <div className='h-[460px] overflow-y-auto p-4 space-y-3'>
            {messages.map((m, i) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={i}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={[
                      'max-w-[82%] whitespace-pre-wrap px-4 py-2 rounded-2xl text-[0.95rem] leading-relaxed shadow',
                      isUser
                        ? 'bg-gradient-to-br from-cyan-400 to-cyan-500 text-black rounded-br-md'
                        : 'bg-neutral-900 text-cyan-200 font-semibold rounded-bl-md border border-cyan-800/50',
                    ].join(' ')}
                    dangerouslySetInnerHTML={{ __html: m.content }}
                  />
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className='p-3 border-t border-cyan-800 flex gap-2'
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Type your message…'
              className='flex-1 rounded-xl border border-cyan-800 bg-neutral-950 px-3 py-2 text-sm text-white outline-none focus:ring focus:ring-cyan-500/50'
            />
            <button
              type='submit'
              disabled={loading}
              className='rounded-xl px-3 py-2 text-sm bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition disabled:opacity-60'
            >
              {loading ? '…' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
