/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit-Regular"],
        "outfit-medium": ["Outfit-Medium"],
        "outfit-semibold": ["Outfit-SemiBold"],
        "outfit-bold": ["Outfit-Bold"],
      },
    },
  },
  plugins: [],
};
