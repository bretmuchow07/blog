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
        'surface-elevated': 'var(--surface-elevated)',
        'surface-subtle': 'var(--surface-subtle)',
        border: 'var(--border-color)',
        'border-hover': 'var(--border-hover)',
        'border-accent': 'var(--border-accent)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        accent: 'var(--accent)',
        'accent-secondary': 'var(--accent-magenta)',
        'accent-magenta': 'var(--accent-magenta)',
        'accent-yellow': 'var(--accent-yellow)',
        'code-bg': 'var(--code-bg)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
        stamp: ['var(--font-stamp)', 'monospace'],
        brand: ['var(--font-display)', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
