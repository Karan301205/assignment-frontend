
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-darkest': "#001D39",
        'primary-dark': "#0A4174",
        'primary-base': "#49769F",
        'secondary-dark': "#4E8EA2",
        'secondary-base': "#6EA2B3",
        'accent-light': "#7BBDE8",
        'accent-pale': "#BDD8E9",
      },
    },
  },
  plugins: [],
};