/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./utils/**/*.{js,jsx,ts,tsx}", "./constants/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    // Dynamic text colors, backgrounds, borders used via template strings
    { pattern: /^(text|bg|border|from|to|via)-(red|green|blue|purple|orange|yellow|pink|indigo|emerald|teal|cyan|sky|lime|amber|violet|fuchsia|rose)-(50|100|200|300|400|500|600|700|800|900)$/ },
    // Rounded sizes and spacing utilities that may be constructed dynamically
    { pattern: /^(rounded(-(sm|md|lg|xl|2xl|3xl|full))?)$/ },
    { pattern: /^(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml)-(0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12)$/ },
    // Opacity variants
    { pattern: /^(bg|text|border)-opacity-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)$/ },
    // Dark mode variants
    { pattern: /^dark:(text|bg|border)-(white|black|gray-(50|100|200|300|400|500|600|700|800|900))$/ },
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}