/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          DEFAULT: '#00000066',
          light: '#ffffff'
        }
      }
    },
    tooltipArrows: theme => ({
      'danger-arrow-bottom': {
        position: theme('absosulte'),
      },
      'danger-arrow': {
        borderColor: theme('colors.red.400'),
        borderWidth: 1,
        backgroundColor: theme('colors.red.200'),
        size: 10,
        offset: 10
      },
    }),
  },
  variants: {
    // scrollbar: ['rounded'],
  }
}
