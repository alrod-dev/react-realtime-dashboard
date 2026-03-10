import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          150: '#e7ecf1',
          200: '#e2e8f0',
          250: '#d8dfe8',
          300: '#cbd5e1',
          350: '#b8c5d0',
          400: '#94a3b8',
          450: '#7a8596',
          500: '#64748b',
          550: '#515c6b',
          600: '#475569',
          650: '#3d464f',
          700: '#334155',
          750: '#2a3540',
          800: '#1e293b',
          850: '#15202d',
          900: '#0f172a',
          950: '#0a0e1a',
        },
      },
      backgroundColor: {
        dark: '#0f172a',
        'dark-secondary': '#1e293b',
      },
      textColor: {
        dark: '#e2e8f0',
        'dark-secondary': '#cbd5e1',
      },
      borderColor: {
        dark: '#334155',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        sidebar: '16rem',
      },
    },
  },
  plugins: [],
};

export default config;
