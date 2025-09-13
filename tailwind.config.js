/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#10A5FF',
          gold: '#F5C76B',
        },
      },
      boxShadow: {
        gold: '0 0 10px #F5C76B',
      },
    },
  },
};
