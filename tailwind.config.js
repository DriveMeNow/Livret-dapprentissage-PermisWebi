/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pw-yellow':   '#FFBE00',
        'pw-yellow-h': '#f5a623',
        'pw-dark':     '#07111f',
        'pw-darker':   '#0d1b3e',
        'pw-navy':     '#0a1e2f',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'pw-gradient': 'linear-gradient(160deg, #0d1b3e, #07111f, #0a1e2f)',
      }
    },
  },
  plugins: [],
}
