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
        'primary': {
          DEFAULT: '#76C72F', // O verde principal dos botões e banners
          'light': '#EBF7E3', // O fundo verde-claro (como no 1º app)
          'dark': '#5A9A24',  // Um tom mais escuro para hover de botões
        },
        'text-primary': '#333333', // O cinza-escuro principal para textos
        'text-secondary': '#757575', // Cinza-médio para placeholders e subtextos
        'border-light': '#E0E0E0', // Borda suave dos inputs
        'background': '#F9FAFB',  // Fundo da página (um cinza muito leve)
      },
      borderRadius: {
        'xl': '1rem', // 16px (para botões e cards, como na imagem)
        '2xl': '1.5rem', // 24px
        '3xl': '2rem',   // 32px
      },
      boxShadow: {
         'card': '0 4px 12px rgba(0, 0, 0, 0.05)', // Uma sombra suave
      }
    },
  },
  plugins: [],
};
export default config;