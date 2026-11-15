/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0B',
        api: { DEFAULT: '#E63E14', dark: '#C7300C', light: '#FF6A3D', soft: '#FBE9E3' },
        abu: '#F4F4F4',
        garis: '#D9D9D9',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { halaman: '1248px' },
    },
  },
  plugins: [],
}
