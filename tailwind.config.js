module.exports = {
  purge: {
    content: [
      './src/**/*.html',
      './src/**/*.vue',
    ],
  },
  theme: {
    extend: {
      gridTemplateColumns: {
        'card-2': '[left] 1fr [center] 1fr [right]',
      }
    },
  },
  plugins: [
    require('@savvywombat/tailwindcss-grid-named-lines'),
  ],
};