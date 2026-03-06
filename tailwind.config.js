module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-dm)", "system-ui", "sans-serif"],
        hero: ["var(--font-coiny)", "system-ui", "sans-serif"],
        lilita: ["var(--font-lilita)", "system-ui", "sans-serif"],
        luckiest: ["var(--font-luckiest)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
