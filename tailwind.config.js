/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VetBot Brand Colors
        primary: {
          50: '#eff6ff',
          500: '#1e40af',   // Validation Blue - trust & reliability
          600: '#1d4ed8',   // Active states
          700: '#1e3a8a',   // Hover states
          900: '#1e3a8a',
        },
        secondary: {
          100: '#fed7aa',   // Light alerts
          500: '#ea580c',   // Assessment Orange - warnings & critical findings
          700: '#c2410c',   // High priority items
        },
        success: {
          100: '#dcfce7',   // Success backgrounds
          500: '#16a34a',   // Passed tests, good scores
          700: '#15803d',   // Strong positive emphasis
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}