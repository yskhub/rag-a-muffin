/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#00f0ff",
        accent: "#0fffc1",
        bgDark: "#020617",
        cardDark: "rgba(15, 23, 42, 0.6)",
      },
      boxShadow: {
        glow: "0 0 15px rgba(0, 240, 255, 0.1)",
        glowStrong: "0 0 25px rgba(0, 240, 255, 0.3)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
