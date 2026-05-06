import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        page: 'var(--color-page)',
        fg: 'var(--color-fg)',
        muted: 'var(--color-muted)',
      },
      fontSize: {
        'display': ['2.25rem', { lineHeight: '1.15', fontWeight: '600' }],
        'lead': ['1.125rem', { lineHeight: '1.6' }],
      },
    },
  },
} satisfies Config
