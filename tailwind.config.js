/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forge-black': '#222831',
        'forge-grey': '#393E46',
        'forge-muted': '#948979',
        'forge-beige': '#DFD0B8',
      }
    },
  },
  plugins: [],
}

