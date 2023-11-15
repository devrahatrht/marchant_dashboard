
module.exports = {
  content: ["./src/**/*.{html,js}"],
  daisyui: {
    themes: ["lofi"],
  },
  theme: {
    container: {
      center: true
    },
    extend: {},
  },
  plugins: [require("daisyui")],
}

