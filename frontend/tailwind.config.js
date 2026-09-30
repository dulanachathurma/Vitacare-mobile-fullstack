/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans Sinhala', 'Noto Sans Tamil', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
