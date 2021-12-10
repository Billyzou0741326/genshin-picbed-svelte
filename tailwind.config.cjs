const production = !process.env.ROLLUP_WATCH;
module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{html,svelte}',
  ],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'montserrat': 'Montserrat'
      },
      gridTemplateColumns: {
        'settings-sidebar': '200px minmax(100px, max-content)',
      },
    },
  },
  variants: {
    extend: {
      fontFamily: ['hover', 'focus'],
    },
  },
  plugins: [],
}
