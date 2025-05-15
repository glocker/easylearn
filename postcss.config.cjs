// The whole project written in ESM style but here is tiny exception
// postcss config should be CommonJS
// because PostCSS in Next.js (inside Webpack) doesn't work with .mjs and export default
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
