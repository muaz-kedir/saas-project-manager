/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          bg: '#2C2D33',        // Main background
          card: '#1E1F24',      // Card background
          sidebar: '#1A1B1F',   // Sidebar background
          border: '#3A3B41',    // Border color
          text: '#E8E9ED',      // Primary text
          muted: '#9A9BA5',     // Muted text
        },
        // Accent colors from the design
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',       // Main purple/blue
          600: '#5558DD',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          yellow: '#FFD666',
          pink: '#FF6B9D',
          blue: '#6B8AFF',
          purple: '#9B6BFF',
          green: '#4ECDC4',
          orange: '#FFB366',
        }
      },
      backgroundColor: {
        'dark-primary': '#2C2D33',
        'dark-secondary': '#1E1F24',
        'dark-tertiary': '#1A1B1F',
      }
    },
  },
  plugins: [],
}
