import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0B12',
        surface: {
          DEFAULT: '#13131F',
          muted: '#1B1B2C',
          bright: '#232338',
        },
        border: {
          DEFAULT: '#232338',
          pink: '#FF2E93',
          yellow: '#FFE600',
        },
        pink: {
          DEFAULT: '#FF2E93',
          hot: '#FF2E93',
          glow: '#FF007A',
          dark: '#B81363',
        },
        yellow: {
          DEFAULT: '#FFE600',
          electric: '#FFE600',
          dark: '#CCA700',
        },
        cyan: {
          DEFAULT: '#00F0FF',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Bebas Neue', 'Anton', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'hard-pink': '4px 4px 0px 0px #FF2E93',
        'hard-pink-lg': '6px 6px 0px 0px #FF2E93',
        'hard-yellow': '4px 4px 0px 0px #FFE600',
        'hard-yellow-lg': '6px 6px 0px 0px #FFE600',
        'hard-white': '4px 4px 0px 0px #FFFFFF',
        'hard-card': '6px 6px 0px 0px rgba(255, 46, 147, 0.4)',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

