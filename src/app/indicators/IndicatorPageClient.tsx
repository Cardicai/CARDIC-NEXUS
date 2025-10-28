'use client';
import React from 'react';

type Stack = { id: string; title: string; description?: string; price?: string };
type Pkg = { id: string; name: string; price?: string; perks?: string[] };
type Faq = { question: string; answer: string };

export default function IndicatorPageClient(props: {
  indicatorStacks?: Stack[];
  packages?: Pkg[];
  faqs?: Faq[];
}) {
  const { indicatorStacks = [], packages = [], faqs = [] } = props;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Premium Indicators</h1>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {indicatorStacks.map((s) => (
          <div key={s.id} className="rounded-xl border border-white/10 p-4">
            <h3 className="text-lg font-semibold">{s.title}</h3>
            {s.description && <p className="mt-1 text-sm opacity-80">{s.description}</p>}
            {s.price && <p className="mt-2 text-sm">{s.price}</p>}
          </div>
        ))}
        {indicatorStacks.length === 0 && (
          <p className="text-sm opacity-70">No indicators listed.</p>
        )}
      </section>

      <h2 className="mt-10 text-2xl font-bold">Packages</h2>
      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        {packages.map((p) => (
          <div key={p.id} className="rounded-xl border border-white/10 p-4">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            {p.price && <p className="mt-1 text-sm">{p.price}</p>}
            {Array.isArray(p.perks) && p.perks.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm opacity-90">
                {p.perks.map((perk, i) => (
                  <li key={i}>{perk}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {packages.length === 0 && <p className="text-sm opacity-70">No packages found.</p>}
      </section>

      <h2 className="mt-10 text-2xl font-bold">FAQs</h2>
      <section className="mt-4 space-y-3">
        {faqs.map((f, i) => (
          <details key={i} className="rounded-xl border border-white/10 p-4">
            <summary className="cursor-pointer font-medium">{f.question}</summary>
            <p className="mt-2 text-sm opacity-80">{f.answer}</p>
          </details>
        ))}
        {faqs.length === 0 && <p className="text-sm opacity-70">No FAQs yet.</p>}
      </section>
    </div>
  );
}
