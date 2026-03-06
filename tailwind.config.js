/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        edmark: {
          'dark-blue': '#1a2d4a',
          red: '#c41e3a',
          yellow: '#f4c430',
          green: '#2d8b57',
          'light-blue': '#5dade2',
          'neutral-50': '#f9fafb',
          'neutral-100': '#f3f4f6',
          'neutral-200': '#e5e7eb',
          'neutral-700': '#374151',
          'neutral-900': '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
