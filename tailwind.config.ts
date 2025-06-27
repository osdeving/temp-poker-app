import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
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
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
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
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        // Custom poker animations
        'fadeIn': {
          from: {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slideInLeft': {
          from: {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'slideInRight': {
          from: {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'slideInUp': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slideInDown': {
          from: {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'bounceSubtle': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
        },
        'glowPulseYellow': {
          '0%': {
            boxShadow: '0 0 5px rgba(250, 204, 21, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(250, 204, 21, 0.6), 0 0 30px rgba(250, 204, 21, 0.4)',
          },
          '100%': {
            boxShadow: '0 0 5px rgba(250, 204, 21, 0.3)',
          },
        },
        'glowPulseCyan': {
          '0%': {
            boxShadow: '0 0 5px rgba(0, 255, 255, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.6), 0 0 30px rgba(0, 255, 255, 0.4)',
          },
          '100%': {
            boxShadow: '0 0 5px rgba(0, 255, 255, 0.3)',
          },
        },
        'glowPulsePink': {
          '0%': {
            boxShadow: '0 0 5px rgba(255, 20, 147, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(255, 20, 147, 0.6), 0 0 30px rgba(255, 20, 147, 0.4)',
          },
          '100%': {
            boxShadow: '0 0 5px rgba(255, 20, 147, 0.3)',
          },
        },
        'glowPulseGreen': {
          '0%': {
            boxShadow: '0 0 5px rgba(0, 255, 0, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.6), 0 0 30px rgba(0, 255, 0, 0.4)',
          },
          '100%': {
            boxShadow: '0 0 5px rgba(0, 255, 0, 0.3)',
          },
        },
        'eliminationFlash': {
          '0%': {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
          },
          '50%': {
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
          },
          '100%': {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
          },
        },
        'loading': {
          '0%': {
            backgroundPosition: '200% 0',
          },
          '100%': {
            backgroundPosition: '-200% 0',
          },
        },
        'card-deal': {
          from: {
            transform: 'rotateY(180deg) translateY(-50px)',
            opacity: '0',
          },
          to: {
            transform: 'rotateY(0deg) translateY(0)',
            opacity: '1',
          },
        },
        'player-glow': {
          from: {
            opacity: '0.3',
            transform: 'scale(1)',
          },
          to: {
            opacity: '0.7',
            transform: 'scale(1.05)',
          },
        },
        'pot-glow': {
          from: {
            opacity: '0.5',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1.05)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // Custom animations
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideInLeft': 'slideInLeft 0.3s ease-out',
        'slideInRight': 'slideInRight 0.3s ease-out',
        'slideInUp': 'slideInUp 0.3s ease-out',
        'slideInDown': 'slideInDown 0.3s ease-out',
        'bounceSubtle': 'bounceSubtle 2s ease-in-out infinite',
        'glowPulseYellow': 'glowPulseYellow 2s ease-in-out infinite',
        'glowPulseCyan': 'glowPulseCyan 2s ease-in-out infinite',
        'glowPulsePink': 'glowPulsePink 2s ease-in-out infinite',
        'glowPulseGreen': 'glowPulseGreen 2s ease-in-out infinite',
        'eliminationFlash': 'eliminationFlash 0.5s ease-in-out',
        'loading': 'loading 1.5s infinite',
        'card-deal': 'card-deal 0.5s ease-out forwards',
        'player-glow': 'player-glow 1.5s ease-in-out infinite alternate',
        'pot-glow': 'pot-glow 2s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
