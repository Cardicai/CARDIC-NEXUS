// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0b0d',
        ink2: '#0e0f12',
        brand: {
          blue: '#10A5FF',
          gold: '#F5C76B',
          goldDeep: '#B77A2B',
          goldLite: '#FFD27A',
        },
      },
      letterSpacing: {
        nexus: '.22em',
      },
      dropShadow: {
        blue: [
          '0 0 10px rgba(16,165,255,.55)',
          '0 0 22px rgba(16,165,255,.35)',
        ],
        gold: ['0 0 12px rgba(245,199,107,.45)'],
      },
      boxShadow: {
        goldThin:
          '0 0 0 1px rgba(245,199,107,.35), 0 0 24px rgba(245,199,107,.15)',
      },
      borderRadius: {
        xl2: '1rem',
      },
    },
  },
  plugins: [],
};
export default config;
