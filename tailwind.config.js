/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
      colors: {
        background: '#F5F0EA',
        foreground: '#111111',
        card: '#EDE8DF',
        muted: '#D4C5B0',
        'muted-foreground': '#888888',
        border: '#D4C5B0',
      },
      letterSpacing: {
        widest: '0.3em',
        wider: '0.2em',
        wide: '0.15em',
      },
    },
  },
  plugins: [],
}