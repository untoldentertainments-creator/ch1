import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#05070a',
          card: 'rgba(13, 18, 30, 0.72)',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#f59e0b',
          gold: '#EAB308',
          sky: '#38bdf8',
          crimson: '#ef4444',
        },
      },
      fontFamily: {
        editorial: ['"Instrument Serif"', 'Georgia', 'serif'],
        cinzel: ['var(--font-cinzel)', 'Cinzel', 'serif'],
        mono: ['var(--font-space-mono)', '"Space Mono"', 'monospace'],
        sans: ['var(--font-plus-jakarta)', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['var(--font-bebas-neue)', '"Bebas Neue"', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 26s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
