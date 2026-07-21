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
        stone: {
          750: '#373330'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
