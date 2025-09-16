export const metadata = { title: 'CARDIC Heat — Details' };

export default function CardicHeatDetails() {
  return (
    <main
      style={{
        minHeight: '100vh',
        color: '#fff',
        background: 'linear-gradient(180deg,#0a0b0d,#0e0f12)',
        padding: '32px 16px',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 8px' }}>
          <span
            style={{
              background:
                'linear-gradient(180deg,#FFD27A,#F5C76B 45%,#C98E3A 70%,#B77A2B)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            CARDIC
          </span>{' '}
          <span
            style={{
              color: '#10A5FF',
              textShadow: '0 0 12px rgba(16,165,255,.55)',
            }}
          >
            Heat
          </span>
        </h1>
        <p style={{ opacity: 0.85, margin: '6px 0 18px' }}>
          Tracks liquidity zones, sentiment and signals in real time.
        </p>
        <div
          style={{
            display: 'grid',
            gap: 14,
            gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          }}
        >
          {[
            { v: '2.0', price: '$25', note: '2 months access' },
            { v: '2.1', price: '$35', note: '2 months access' },
            { v: '2.3 (Early Access)', price: '$50', note: '1 month only 🚀' },
          ].map((x) => (
            <article
              key={x.v}
              style={{
                background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(255,255,255,.14)',
                borderRadius: 18,
                padding: 16,
                boxShadow:
                  '0 0 0 1px rgba(245,199,107,.35),0 0 24px rgba(245,199,107,.12)',
              }}
            >
              <h3 style={{ margin: '0 0 6px' }}>CARDIC Heat {x.v}</h3>
              <div style={{ fontWeight: 800, color: '#10A5FF' }}>{x.price}</div>
              <div style={{ opacity: 0.85, margin: '4px 0 12px' }}>
                {x.note}
              </div>
              <a
                href='/#pay'
                style={{
                  display: 'inline-block',
                  padding: '10px 14px',
                  borderRadius: 14,
                  background: '#10A5FF',
                  color: '#000',
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                Buy
              </a>
            </article>
          ))}
        </div>
        <p style={{ opacity: 0.8, marginTop: 18 }}>
          📈 Higher versions = more dynamic, sharper, more powerful signals.
        </p>
      </div>
    </main>
  );
}
