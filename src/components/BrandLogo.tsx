export default function BrandLogo({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div className={`cnx-logo ${size}`}>
      <span className='gold'>CARDIC</span> <span className='blue'>NEXUS</span>
      <div className='tag'>AI • TRADING</div>
      <style jsx>{`
        .cnx-logo {
          font-weight: 800;
          line-height: 1;
          letter-spacing: 0.2px;
        }
        .cnx-logo.sm {
          font-size: 18px;
        }
        .cnx-logo.md {
          font-size: 20px;
        }
        .cnx-logo.lg {
          font-size: 28px;
        }
        .tag {
          margin-top: 2px;
          font-size: 10px;
          color: #9ea6b3;
          letter-spacing: 0.12em;
        }
        .gold {
          background: linear-gradient(
            180deg,
            #ffd27a 0%,
            #f5c76b 45%,
            #c98e3a 70%,
            #b77a2b 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 14px rgba(245, 199, 107, 0.35);
        }
        .blue {
          color: #10a5ff;
          letter-spacing: 0.22em;
          text-shadow: 0 0 10px rgba(16, 165, 255, 0.55),
            0 0 22px rgba(16, 165, 255, 0.35);
        }
      `}</style>
    </div>
  );
}
