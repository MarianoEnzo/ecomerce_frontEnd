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
  background: '#FFFCF2',
  foreground: '#252422',
  card: '#F0EDE4',
  muted: '#CCC5B9',
  'muted-foreground': '#8A8078',
  border: '#CCC5B9',
  accent: '#EB5E28',
},erSpacing: {
        widest: '0.3em',
        wider: '0.2em',
        wide: '0.15em',
      },
    },
  },
  plugins: [],
}