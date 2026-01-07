/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // Menggunakan plugin baru untuk v4
    autoprefixer: {},
  },
};

export default config;