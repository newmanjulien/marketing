import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,svx,ts}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body)'],
        heading: ['var(--font-heading)']
      },
      fontWeight: {
        book: '350'
      },
      colors: {
        // Warmer, slightly more yellow take on Tailwind's default stone scale
        // (blue channel nudged down so each shade reads a touch more golden).
        stone: {
          50: '#fafaf8',
          100: '#f6f5f3',
          150: '#f0eeec',
          200: '#e9e6e3',
          250: '#e1ded9',
          300: '#d9d5cf',
          350: '#c2bdb5',
          400: '#aba49b',
          450: '#938c82',
          500: '#7b7369',
          550: '#6a645b',
          600: '#59554c',
          650: '#504b43',
          700: '#46413b',
          750: '#39342e',
          800: '#2a2622',
          850: '#24201c',
          900: '#1d1a16',
          950: '#0d0b09'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
