/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: '#FFF8E1',
        primary: '#EC8F5E',
        secondary: '#F3B764',
        'dark-grey': '#969696',
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