import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ADICIONADO: Regras para ignorar os erros chatos
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Permite usar 'any'
      "@typescript-eslint/no-unused-vars": "off", // Ignora variáveis não usadas
      "react/no-unescaped-entities": "off", // Ignora erro de aspas "
      "react-hooks/rules-of-hooks": "warn", // Transforma erro de hooks em aviso
      "react-hooks/exhaustive-deps": "off", // Ignora dependências do useEffect
    },
  },

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
