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
      animation: {
        'banner-gradient': 'banner-gradient 8s linear infinite',
      },
      keyframes: {
        'banner-gradient': {
          from: { 'backgroundPosition': '0% center' },
          to: { 'background-position': '200% center' },
        }
      }  
    },
  },
  plugins: [],
};
