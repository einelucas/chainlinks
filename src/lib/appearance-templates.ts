import type { ButtonSize } from "./types";

export type TemplateTheme = {
  bgType: string;
  bgColor: string;
  bgGradientFrom: string;
  bgGradientTo: string;
  bgGradientAngle: number;
  fontFamily: string;
  textColor: string;
  bioColor: string;
  accentColor: string;
  buttonBgColor: string;
  buttonBorderColor: string;
  buttonTextColor: string;
  buttonRadius: number;
  buttonSize: ButtonSize;
  buttonShadowColor: string;
  hoverBgColor: string;
  hoverGlowColor: string;
  hoverScale: number;
};

export type AppearanceTemplate = {
  id: string;
  name: string;
  description: string;
  theme: TemplateTheme;
};

export const APPEARANCE_TEMPLATES: AppearanceTemplate[] = [
  {
    id: "padrao",
    name: "Padrão",
    description: "Escuro com destaque neon verde. O visual original do ChainLinks.",
    theme: {
      bgType: "color",
      bgColor: "#0a0a0a",
      bgGradientFrom: "#0a0a0a",
      bgGradientTo: "#111111",
      bgGradientAngle: 135,
      fontFamily: "Montserrat",
      textColor: "#ffffff",
      bioColor: "#dcdcdc",
      accentColor: "#00ff6a",
      buttonBgColor: "rgba(0,0,0,0.55)",
      buttonBorderColor: "#00ff6a",
      buttonTextColor: "#ffffff",
      buttonRadius: 50,
      buttonSize: "medium",
      buttonShadowColor: "rgba(0,255,100,0.15)",
      hoverBgColor: "rgba(0,255,100,0.15)",
      hoverGlowColor: "rgba(0,255,100,0.45)",
      hoverScale: 1.04,
    },
  },
  {
    id: "minimal-claro",
    name: "Minimal Claro",
    description: "Fundo claro, tipografia limpa. Ideal para um visual neutro e profissional.",
    theme: {
      bgType: "color",
      bgColor: "#f5f5f4",
      bgGradientFrom: "#f5f5f4",
      bgGradientTo: "#e7e5e4",
      bgGradientAngle: 135,
      fontFamily: "Inter",
      textColor: "#18181b",
      bioColor: "#52525b",
      accentColor: "#18181b",
      buttonBgColor: "#ffffff",
      buttonBorderColor: "#e4e4e7",
      buttonTextColor: "#18181b",
      buttonRadius: 16,
      buttonSize: "medium",
      buttonShadowColor: "rgba(0,0,0,0.08)",
      hoverBgColor: "#f4f4f5",
      hoverGlowColor: "rgba(0,0,0,0.06)",
      hoverScale: 1.02,
    },
  },
  {
    id: "por-do-sol",
    name: "Pôr do Sol",
    description: "Gradiente quente laranja e âmbar, para páginas com energia e calor.",
    theme: {
      bgType: "gradient",
      bgColor: "#ff6a3d",
      bgGradientFrom: "#ff6a3d",
      bgGradientTo: "#ffb84d",
      bgGradientAngle: 135,
      fontFamily: "Poppins",
      textColor: "#ffffff",
      bioColor: "rgba(255,255,255,0.85)",
      accentColor: "#fff3e0",
      buttonBgColor: "rgba(0,0,0,0.25)",
      buttonBorderColor: "rgba(255,255,255,0.4)",
      buttonTextColor: "#ffffff",
      buttonRadius: 24,
      buttonSize: "medium",
      buttonShadowColor: "rgba(0,0,0,0.2)",
      hoverBgColor: "rgba(255,255,255,0.15)",
      hoverGlowColor: "rgba(255,255,255,0.35)",
      hoverScale: 1.03,
    },
  },
  {
    id: "oceano",
    name: "Oceano",
    description: "Gradiente azul-petróleo profundo com destaque em turquesa.",
    theme: {
      bgType: "gradient",
      bgColor: "#0f2027",
      bgGradientFrom: "#0f2027",
      bgGradientTo: "#2c5364",
      bgGradientAngle: 160,
      fontFamily: "Space Grotesk",
      textColor: "#ffffff",
      bioColor: "#b8e6e0",
      accentColor: "#64ffda",
      buttonBgColor: "rgba(255,255,255,0.08)",
      buttonBorderColor: "#64ffda",
      buttonTextColor: "#ffffff",
      buttonRadius: 14,
      buttonSize: "medium",
      buttonShadowColor: "rgba(100,255,218,0.2)",
      hoverBgColor: "rgba(100,255,218,0.12)",
      hoverGlowColor: "rgba(100,255,218,0.4)",
      hoverScale: 1.04,
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Preto e branco de alto contraste com serifa, para um tom sofisticado.",
    theme: {
      bgType: "color",
      bgColor: "#ffffff",
      bgGradientFrom: "#ffffff",
      bgGradientTo: "#f0f0f0",
      bgGradientAngle: 135,
      fontFamily: "Playfair Display",
      textColor: "#000000",
      bioColor: "#444444",
      accentColor: "#000000",
      buttonBgColor: "#000000",
      buttonBorderColor: "#000000",
      buttonTextColor: "#ffffff",
      buttonRadius: 0,
      buttonSize: "large",
      buttonShadowColor: "rgba(0,0,0,0.15)",
      hoverBgColor: "#1a1a1a",
      hoverGlowColor: "rgba(0,0,0,0.25)",
      hoverScale: 1.0,
    },
  },
  {
    id: "pastel",
    name: "Pastel",
    description: "Rosa suave e lilás, um visual delicado para conteúdo lifestyle.",
    theme: {
      bgType: "color",
      bgColor: "#fdf2f8",
      bgGradientFrom: "#fdf2f8",
      bgGradientTo: "#fce7f3",
      bgGradientAngle: 135,
      fontFamily: "DM Sans",
      textColor: "#831843",
      bioColor: "#be185d",
      accentColor: "#ec4899",
      buttonBgColor: "#ffffff",
      buttonBorderColor: "#fbcfe8",
      buttonTextColor: "#831843",
      buttonRadius: 30,
      buttonSize: "medium",
      buttonShadowColor: "rgba(236,72,153,0.15)",
      hoverBgColor: "#fce7f3",
      hoverGlowColor: "rgba(236,72,153,0.3)",
      hoverScale: 1.03,
    },
  },
  {
    id: "neon-roxo",
    name: "Néon Roxo",
    description: "Fundo escuro violeta com brilho neon roxo, para um visual noturno e vibrante.",
    theme: {
      bgType: "color",
      bgColor: "#0d0221",
      bgGradientFrom: "#0d0221",
      bgGradientTo: "#1a0b3d",
      bgGradientAngle: 135,
      fontFamily: "Sora",
      textColor: "#ffffff",
      bioColor: "#c9b8ff",
      accentColor: "#b026ff",
      buttonBgColor: "rgba(176,38,255,0.12)",
      buttonBorderColor: "#b026ff",
      buttonTextColor: "#ffffff",
      buttonRadius: 50,
      buttonSize: "medium",
      buttonShadowColor: "rgba(176,38,255,0.3)",
      hoverBgColor: "rgba(176,38,255,0.2)",
      hoverGlowColor: "rgba(176,38,255,0.5)",
      hoverScale: 1.05,
    },
  },
  {
    id: "impacto",
    name: "Impacto",
    description: "Preto e amarelo em alto contraste, letras condensadas para chamar atenção.",
    theme: {
      bgType: "color",
      bgColor: "#111111",
      bgGradientFrom: "#111111",
      bgGradientTo: "#1c1c1c",
      bgGradientAngle: 135,
      fontFamily: "Oswald",
      textColor: "#ffffff",
      bioColor: "#d4d4d4",
      accentColor: "#ffcc00",
      buttonBgColor: "#ffcc00",
      buttonBorderColor: "#ffcc00",
      buttonTextColor: "#111111",
      buttonRadius: 8,
      buttonSize: "large",
      buttonShadowColor: "rgba(255,204,0,0.25)",
      hoverBgColor: "#ffd633",
      hoverGlowColor: "rgba(255,204,0,0.5)",
      hoverScale: 1.03,
    },
  },
];
