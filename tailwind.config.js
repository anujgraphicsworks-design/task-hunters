/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5ed',
          100: '#ffe8d5',
          200: '#ffd0aa',
          300: '#ffae75',
          400: '#ff813d',
          500: '#ff5500', // Primary logo orange
          600: '#e64200',
          700: '#bf3000',
          800: '#992704',
          900: '#7c230a',
          950: '#430e03',
        },
        dark: {
          bg: '#090D16',       // Authentic deep obsidian canvas
          card: '#121826',     // Authentic dark card background
          cardHover: '#182032',// Card hover
          border: '#202B3F',   // Border slate
          muted: '#8A99AD',    // Subtitle text
          light: '#E2E8F0',    // Main text
        },
        light: {
          bg: '#FAFAFC',       // Off-white light canvas
          card: '#FFFFFF',     // Pure white card
          cardHover: '#F8FAFC',// Light slate hover
          border: '#E2E8F0',   // Hairline border slate
          muted: '#64748B',    // Muted text
          dark: '#0F172A',     // Primary text dark slate
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(255, 85, 0, 0.4)',
        'glow-orange-sm': '0 0 15px -3px rgba(255, 85, 0, 0.3)',
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.4)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.2s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(3px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
