export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      },
      colors: {
        // fg: "rgb(from var(--fg) r g b / <alpha-value>)",
        // bg: "rgb(from var(--bg) r g b / <alpha-value>)",
        // footer: "rgb(from var(--footer) r g b / <alpha-value>)",
        // "bg-highlight": "rgb(from var(--bg-highlight) r g b / <alpha-value>)",
        // "fg-hover": "rgb(from var(--fg-hover) r g b / <alpha-value>)",
        // "bg-blue": "rgb(from var(--bg-blue) r g b / <alpha-value>)",
        // text: "rgb(from var(--text) r g b / <alpha-value>)",
        // "text-hover": "rgb(from var(--text-hover) r g b / <alpha-value>)",
        // "text-secondary": "rgb(from var(--text-secondary) r g b / <alpha-value>)",
        // "text-alt": "rgb(from var(--text-alt) r g b / <alpha-value>)",
        // "text-dark": "rgb(from var(--text-dark) r g b / <alpha-value>)",
        // "accent-red": "rgb(from var(--accent-red) r g b / <alpha-value>)",
        // "accent-red-hover": "rgb(from var(--accent-red-hover) r g b / <alpha-value>)"
      },
    },
  },
  plugins: [],
};
