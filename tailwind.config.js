/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/index.js",
    "./src/input.css",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#D0EBFF',
          200: '#A1D3FF',
          300: '#73B8FF',
          400: '#509FFF',
          500: '#1676FF',
          600: '#105BDB',
          700: '#0B43B7',
          800: '#072F93',
          900: '#04217A',
        },
        secBrand: {
          500: '#F6AE3F'
        },
        neutral: {
          100: '#EDF1FA',
          200: '#DCE3F6',
          300: '#C1CAE5',
          400: '#A3ACCB',
          500: '#7D86A9',
          600: '#5B6591',
          700: '#3F4879',
          800: '#273062',
          900: '#181E51',
        },
        semantic: {
          success: {            
            500: '#29C455',
          },
          danger: {
            500: '#FF473A',
          }
        }
      }
    }
  },
  plugins: [],

  variants: {
      extend: {
        fontWeight: ['hover', 'focus'],
        textColor: ['hover', 'focus'],
        backgroundColor: ['hover', 'focus'],
      },
    },
}

