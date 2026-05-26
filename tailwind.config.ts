import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Spectral', 'Georgia', 'serif']
      },
      boxShadow: {
        button: '0 1px 2px rgba(0, 0, 0, 0.08)',
        primary: '0 2px 5px rgba(0, 0, 0, 0.22)'
      }
    }
  },
  plugins: []
} satisfies Config;
