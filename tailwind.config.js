/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        api: { DEFAULT: '#E63E14', dark: '#C7300C', light: '#FF6A3D', soft: '#FDE8E1' },
        abu: '#F2F2F0',
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 8px 24px rgba(17,17,17,.08)', lift: '0 16px 40px rgba(17,17,17,.14)' },
    },
  },
  plugins: [],
}
