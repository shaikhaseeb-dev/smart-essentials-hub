/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-cabinet)', 'Georgia', 'serif'],
        body:    ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      colors: {
        accent: {
          50:  '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        ink: {
          DEFAULT: '#0f0f0f',
          soft:    '#374151',
          muted:   '#6b7280',
          faint:   '#9ca3af',
          ghost:   '#e5e7eb',
        },
        surface: {
          DEFAULT: '#ffffff',
          1:       '#fafafa',
          2:       '#f5f5f5',
          3:       '#efefef',
          4:       '#e8e8e8',
        },
      },
      boxShadow: {
        card:        '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.1), 0 12px 40px rgba(0,0,0,0.08)',
        'accent-glow':'0 0 20px rgba(217,70,239,0.2)',
        soft:        '0 2px 8px rgba(0,0,0,0.06)',
        badge:       'inset 0 1px 0 rgba(255,255,255,0.15)',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        shimmer:      'shimmer 1.8s linear infinite',
        'bounce-sm':  'bounceSm 0.6s ease-out',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        bounceSm: {
          '0%, 100%': { transform: 'translateY(0)' },
          '40%':      { transform: 'translateY(-6px)' },
          '70%':      { transform: 'translateY(-2px)' },
        },
      },
      backgroundImage: {
        'hero-dots': 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        'accent-gradient': 'linear-gradient(135deg, #d946ef 0%, #7c3aed 100%)',
        shimmer: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
      },
    },
  },
  plugins: [],
};
