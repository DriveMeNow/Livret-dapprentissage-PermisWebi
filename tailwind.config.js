/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Charte « Élégance » — jetons officiels ──
        'pw-cream':      '#f8f2e5',
        'pw-paper':      '#FFFDF9',
        'pw-bone':       '#F3EDE2',
        'pw-ink':        '#211C16',
        'pw-ink-soft':   '#4A4239',
        'pw-line':       '#E8DFD0',
        'pw-brass':      '#B5863C',
        'pw-brass-deep': '#937025',
        'pw-pine':       '#3D5A4A',
        'pw-clay':       '#B0472F',
        // ── Alias rétro-compatibles (anciens noms → charte) ──
        // L'ancien jaune de marque devient le laiton (accent structure).
        'pw-yellow':   '#B5863C',
        'pw-yellow-h': '#937025',
        // L'ancien sombre/navy devient l'encre (texte & éléments foncés).
        'pw-dark':     '#211C16',
        'pw-darker':   '#211C16',
        'pw-navy':     '#211C16',
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
      backgroundImage: {
        'pw-gradient': 'linear-gradient(160deg, #f8f2e5, #FFFDF9, #F3EDE2)',
      }
    },
  },
  plugins: [],
}
