/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: '#FFF8E1',
        primary: '#DA6E35',
        secondary: '#F3B764',
        success: '#2CDB79',
        info: '#2e9cff',
        warning: '#ecd706',
        danger: '#fe3f11',
        background: '#FFF8E1',
        darkOrange50: '#FDF6EF',
      },
      fontFamily: {
        'helvetica': ['Helvetica'],
        'helvetica-bold': ['Helvetica-Bold'],
        'helvetica-light': ['Helvetica-Light'],
      },
      fontSize: {
        'xs': '8px',
        'sm': '12px',
        'base': '14px',
        'md': '16px',
        'lg': '20px',
        'xl': '24px',
        '2xl': '32px',
      }
    },
  },
  plugins: [],
}