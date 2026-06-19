/** @type {import('tailwindcss').Config} */
const sharedConfig = require("@repo/tailwind-config");

module.exports = {
  ...sharedConfig,
  content: [
    "./src/**/*.{ts,tsx}",
  ],
};
