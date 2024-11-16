  /** @type {import('tailwindcss').Config} */
  import plugin from 'tailwindcss/plugin'

  export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          'scrollbar-width': 'none'
        }
      })
    })
  ],
}
