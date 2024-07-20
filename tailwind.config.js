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