/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#EC8F5E',
        secondary: '#F3B764',
        success: '#2CDB79',
        info: '#2e9cff',
        warning: '#ecd706',
        danger: '#fe3f11',
        background: '#FFF8E1',
      },
      fontFamily: {
        'helvetica': ['Helvetica'],
        'helvetica-bold': ['Helvetica-Bold'],
        'helvetica-light': ['Helvetica-Light'],
      },
    },
  },
  plugins: [],
}