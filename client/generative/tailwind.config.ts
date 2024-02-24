import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customColor: "#0A0320",
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
        playfairDisplay: ['Playfair Display', 'serif'],
        merriweather: ['Merriweather', 'serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        ubuntu: ['Ubuntu', 'sans-serif'],
        comfortaa: ['Comfortaa', 'cursive'],
        lobster: ['Lobster', 'cursive'],
        cormorant: ['Cormorant', 'serif'],
        courgette: ['Courgette', 'cursive'],
        notoSans: ['Noto Sans', 'sans-serif'],
        pacifico: ['Pacifico', 'cursive'],
        sourceCodePro: ['Source Code Pro', 'monospace'],
        cabin: ['Cabin', 'sans-serif'],
        yantramanav: ['Yantramanav', 'sans-serif'],
        kaushanScript: ['Kaushan Script', 'cursive'],
        
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
