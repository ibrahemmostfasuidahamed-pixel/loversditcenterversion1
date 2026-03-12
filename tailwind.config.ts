import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          light: '#81C784',
          dark: '#1B5E20',
        },
        accent: {
          DEFAULT: '#F4A01C',
          dark: '#E65100',
        },
        surface: 'rgba(20, 35, 20, 0.85)',
        background: '#0a0f0a',
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
      },
      backdropBlur: {
        '2xl': '40px',
        '3xl': '60px',
      },
    },
  },
  plugins: [],
};

export default config;
