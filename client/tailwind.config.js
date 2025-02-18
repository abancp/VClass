/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: "#120f18",
        secondery: "#2a243e",
        tersiory: "#1192B8",
        light: "#B6EADA"
      },
      Wcolors: {
        dark: "#ffffff",
        secondery: "#eeeeee",
        tersiory: "#1192B8",
        light: "#120f18"
      },
      backgroundSize: {
        'size-200': '200% 200% 200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0% 0% 0%',
        'pos-100': '100% 100% 100% 100%',
      },
      fontFamily: {
        paint: ["Finger Paint", "serif"]
      },
      padding: {
        header: '3.5rem'
      }
    },
  },
  plugins: [],
}

