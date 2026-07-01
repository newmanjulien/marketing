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
      },
      boxShadow: {
        button: '0 1px 2px rgba(0, 0, 0, 0.08)',
        primary: '0 2px 5px rgba(0, 0, 0, 0.22)'
      }
    }
  },
  plugins: []
} satisfies Config;
