import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import type { PluginAPI } from 'tailwindcss/types/config';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: ['shadow-2xs', 'shadow-xs', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)'],
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        bold: '700',
      },
      boxShadow: {
        'custom-blue': '0 0 4px 1.5px var(--shadow)',
        'custom-gray': '0px 55px 70px 0px rgba(0, 0, 0, 0.03), 0px 55px 90px 0px rgba(0, 0, 0, 0.03)',
      },
      colors: {
        star: 'var(--star)',
        shadow: 'var(--shadow)',
        success: 'var(--success)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'var(--primary-500)',
          foreground: 'hsl(var(--primary-foreground))',
          100: 'var(--primary-primary-100)',
          200: 'var(--primary-primary-200)',
          300: 'var(--primary-primary-300)',
          400: 'var(--primary-primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-primary-600)',
          700: 'var(--primary-primary-700)',
          800: 'var(--primary-primary-800)',
          900: 'var(--primary-primary-900)',
          '5': 'var(--primary-primary-5)',
          '10': 'var(--primary-primary-10)',
          '20': 'var(--primary-primary-20)',
          '80': 'var(--primary-primary-80)',
          '90': 'var(--primary-primary-90)',
          button: 'var(--primary-button)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          100: 'var(--secondary-secondary-100)',
          200: 'var(--secondary-secondary-200)',
          300: 'var(--secondary-secondary-300)',
          400: 'var(--secondary-secondary-400)',
          500: 'var(--secondary-500)',
          600: 'var(--secondary-secondary-600)',
          700: 'var(--secondary-secondary-700)',
          800: 'var(--secondary-secondary-800)',
          900: 'var(--secondary-secondary-900)',
          '5': 'var(--secondary-secondary-5)',
          '10': 'var(--secondary-secondary-10)',
          '20': 'var(--secondary-secondary-20)',
          '80': 'var(--secondary-secondary-80)',
          '90': 'var(--secondary-secondary-90)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: '#f9fafb',
          foreground: '#333333',
          primary: '#3b82f6',
          'primary-foreground': '#ffffff',
          accent: '#e0f2fe',
          'accent-foreground': '#1e3a8a',
          border: '#e5e7eb',
          ring: '#3b82f6',
        },

        // Tertiary Colors
        tertiary: {
          100: 'var(--tertiary-tertiary-100)',
          200: 'var(--tertiary-tertiary-200)',
          300: 'var(--tertiary-tertiary-300)',
          400: 'var(--tertiary-tertiary-400)',
          500: 'var(--tertiary-500)',
          600: 'var(--tertiary-tertiary-600)',
          700: 'var(--tertiary-tertiary-700)',
          800: 'var(--tertiary-tertiary-800)',
          900: 'var(--tertiary-tertiary-900)',
          '5': 'var(--tertiary-tertiary-5)',
          '10': 'var(--tertiary-tertiary-10)',
          '20': 'var(--tertiary-tertiary-20)',
          '80': 'var(--tertiary-tertiary-80)',
          '90': 'var(--tertiary-tertiary-90)',
        },

        // Dark Colors
        dark: {
          DEFAULT: 'var(--dark-500)',
          '5': 'var(--dark-dark-5)',
          '10': 'var(--dark-dark-10)',
          '20': 'var(--dark-dark-20)',
          '30': 'var(--dark-dark-30)',
          '40': 'var(--dark-dark-40)',
          '50': 'var(--dark-dark-50)',
          '60': 'var(--dark-dark-60)',
          '70': 'var(--dark-dark-70)',
          '80': 'var(--dark-dark-80)',
          '90': 'var(--dark-dark-90)',
        },

        // Gray Colors
        gray: {
          500: 'var(--gray-500)',
          '5': 'var(--gray-gray-5)',
          '10': 'var(--gray-gray-10)',
          '20': 'var(--gray-gray-20)',
          '80': 'var(--gray-gray-80)',
          '90': 'var(--gray-gray-90)',
        },

        // Light Colors
        light: {
          500: 'var(--light-500)',
          '5': 'var(--light-light-5)',
          '10': 'var(--light-light-10)',
          '20': 'var(--light-light-20)',
          '80': 'var(--light-light-80)',
          '90': 'var(--light-light-90)',
        },

        // White Colors
        white: {
          DEFAULT: 'var(--white-500)',
          '5': 'var(--white-white-5)',
          '10': 'var(--white-white-10)',
          '20': 'var(--white-white-20)',
          '80': 'var(--white-white-80)',
          '90': 'var(--white-white-90)',
        },

        // Green Colors
        green: {
          100: 'var(--green-100)',
          200: 'var(--green-200)',
          300: 'var(--green-300)',
          400: 'var(--green-400)',
          DEFAULT: 'var(--green-500)',
          600: 'var(--green-600)',
          700: 'var(--green-700)',
        },

        // Yellow Colors
        yellow: {
          100: 'var(--yellow-100)',
          200: 'var(--yellow-200)',
          300: 'var(--yellow-300)',
          400: 'var(--yellow-400)',
          DEFAULT: 'var(--yellow-500)',
          600: 'var(--yellow-600)',
          700: 'var(--yellow-700)',
          800: 'var(--yellow-800)',
          900: 'var(--yellow-900)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),

    plugin(function ({ addComponents }: PluginAPI) {
      addComponents({
        '.full-bleed': {
          position: 'relative',
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
        },
      });
    }),
  ],
};
export default config;
