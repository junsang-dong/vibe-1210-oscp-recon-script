/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'oscp-red': '#dc2626',
        'oscp-orange': '#f97316',
        'oscp-yellow': '#fbbf24',
        'oscp-blue': '#3b82f6',
      }
    },
  },
  plugins: [],
}

