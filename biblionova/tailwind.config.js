/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          100: '#E8DDD4',
          200: '#D1BAAA',
          300: '#B8957A',
          400: '#9B6F4A',
          500: '#7A4F2B',
          600: '#5C3A1E',
          700: '#3E2510',
          800: '#211206',
          900: '#0F0803',
        },
        cream: '#FAF7F2',
        parchment: '#F0E8D8',
        sage: {
          400: '#7A9E7E',
          500: '#5C8261',
          600: '#3E6644',
        },
        gold: {
          400: '#D4AF37',
          500: '#B8960C',
        }
      },
    },
  },
  plugins: [],
}
