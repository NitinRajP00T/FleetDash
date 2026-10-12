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
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fc',
          400: '#36abfa',
          500: '#0c8ee9',
          600: '#0070cc',
          700: '#0159a6',
          800: '#054b87',
          900: '#0a3f70',
          950: '#07284b',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e1e2e5',
          200: '#c3c5cb',
          300: '#9fa2ad',
          400: '#7a7e8e',
          500: '#606474',
          600: '#4c4f5e',
          700: '#3f414e',
          800: '#262832',
          900: '#1a1c23',
          950: '#0f1015',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
