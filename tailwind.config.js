// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: '#0b0f14', // deep dark
          card: '#0f141b',
          blue: '#16b1ff', // neon blue
          blueSoft: '#0aa6ff',
          teal: '#0f4f56', // button base
          gold: '#f1b34c', // gold text/outline
          goldDim: '#b88a39',
          text: '#ffffff',
          sub: '#cfd6df',
        },
      },
      boxShadow: {
        glowBlue: '0 0 0 1px #16b1ff, 0 0 24px 2px rgba(22,177,255,.45)',
        glowTeal: '0 0 0 1px #16b1ff, 0 0 28px 4px rgba(22,177,255,.35)',
        glowGold: '0 0 0 1px #f1b34c, 0 0 18px 2px rgba(241,179,76,.35)',
      },
    },
  },
  plugins: [],
};
