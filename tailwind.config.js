/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/js/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightblue: '#D6EEFB',
        lightpink: '#FFE6FA',
        purple: '#7954A1',
        lightpurple: '#D3B5E5',
        mediumpurple: '#B19FF9',
        violet: '#5C038C'
      }
    },
    screens: {
      'mobile-xs': {max: '320px'},
      'mobile-md': {max: '375px'},
      'mobile-lg': {max: '430px'},
    },
    boxShadow: {
      'inner': 'inset -5px -5px 150px 10px #D3B5E5;',
      '2xl': '10px 10px #000000;'
    },
    zIndex: {
      '999': '9999',
      '998': '998',
      '997': '997'
    },
  },
  plugins: [],
}

