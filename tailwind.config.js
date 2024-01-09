/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    './layout/*.liquid',
    './templates/*.liquid',
    './templates/customers/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
  ],
  theme: {
    screens: {
      'bsm': {'max': '319px'},
      // => @media (max-width: 639px) { ... } ONLY use if something is require for mobile device ONLY and is not
      // needed on screen sizes above

      'sm': '320px',
      // => @media (min-width: 640px) { ... }

      'bmd': {'max': '749px'},
      // => @media (max-width: 767px) { ... }

      'md': '750px',
      // => @media (min-width: 768px) { ... }

      'blg': {'max': '989px'},
      // => @media (min-width: 1280px) { ... }

      'lg': '990px',
      // => @media (min-width: 1280px) { ... }

      'xl': '1440px',
      pageMaxWidth: '1440px',
    },
    fontFamily: {
      'primary': ["Noto Sans", "system-ui"],
      'secondary': ['Nunito', 'sans-serif'],
      'tertiary': ['Noto\\ Sans', 'sans-serif']
    },
    fontSize: {
      // Mobile
      // [ font-size , { additional properties } ]
      // [ font-size , line-height ]
      'h0-m': ['5rem', { lineHeight: '2.4rem', letterSpacing: '-0.03em' }],
      'h1-m': ['3rem', '5.2rem'],
      'h2-m': ['2rem', '3.12rem'],
      'h3-m': ['1.7rem', '2.21rem'],
      'h4-m': ['1.5rem', '1.95rem'],
      'h5-m': ['1.2rem', '1.69rem'],
      'body-m': ['1.5rem', '2rem'],
      'body-small-m': ['1.3rem', '1.6rem'],
      // Desktop
      'h0': ['5.2rem', '6.4rem'],
      'h1': ['4rem', '5.2rem'],
      'h2': ['2.4rem', '3.12rem'],
      'h3': ['1.8rem', '2.21rem'],
      'h4': ['1.5rem', '1.95rem'],
      'h5': ['1.3rem', '1.69rem'],
      'body': ['1.5rem', '2rem'],
      'body-small': ['1.3rem', '1,6rem']
    },
    extend: {
      colors: {
        'primary': 'rgb(255,0,0)',
        'fantastic-red': '#ff0000',
        'fantastic-green': '#8bc34a',
        'fantastic-blue': '#6461e0',
        'fantastic-something': '#243c5a'
      }
    }
  },
  plugins: [],
};