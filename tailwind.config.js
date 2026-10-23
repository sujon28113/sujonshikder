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
        warm: {
          bg: '#FFFDF7',
          card: '#FEFCE8',
          border: '#FDE68A',
          hover: '#FEF08A',
          accent: '#EAB308',
          'accent-hover': '#CA8A04',
          text: '#1C1917',
          muted: '#57534E',
          subtle: '#78716C',
        },
        espresso: {
          bg: '#141210',
          card: '#1C1917',
          border: '#292524',
          hover: '#292524',
          accent: '#FACC15',
          'accent-hover': '#EAB308',
          text: '#F5F5F4',
          muted: '#A8A29E',
          subtle: '#78716C',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(180, 83, 9, 0.05)',
        'warm-md': '0 4px 12px -2px rgba(180, 83, 9, 0.08), 0 2px 6px -1px rgba(180, 83, 9, 0.04)',
        'warm-lg': '0 10px 25px -3px rgba(180, 83, 9, 0.1), 0 4px 10px -2px rgba(180, 83, 9, 0.05)',
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 12px -2px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.7), 0 4px 10px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
