import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '.light-mode'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas-bg)',
        surface: 'var(--surface-bg)',
        'surface-subtle': 'var(--surface-subtle)',
        border: 'var(--border-color)',
        'border-hover': 'var(--border-hover)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-secondary': 'var(--accent-secondary)',
        'code-bg': 'var(--code-bg)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        brand: ['var(--font-brand)', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
