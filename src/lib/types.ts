export type LinkItemData = {
  id: string;
  label: string;
  url: string;
  icon?: string | null;
  order: number;
  isActive: boolean;
};

export type SocialIconData = {
  id: string;
  platform: string;
  url: string;
  icon?: string | null;
  order: number;
};

export type PageTheme = {
  username: string;
  displayName: string;
  bio: string;
  profileImage?: string | null;

  bgType: string;
  bgColor: string;
  bgGradientFrom: string;
  bgGradientTo: string;
  bgGradientAngle: number;
  bgImage?: string | null;
  overlayOpacity: number;

  fontFamily: string;
  textColor: string;
  bioColor: string;

  buttonBgColor: string;
  buttonBorderColor: string;
  buttonTextColor: string;
  buttonRadius: number;
  buttonShadowColor: string;

  hoverBgColor: string;
  hoverGlowColor: string;
  hoverScale: number;

  accentColor: string;
  showShareButton: boolean;
  showQrButton: boolean;
};

// Ícones padrão embutidos (SVG inline) para as plataformas mais comuns.
// O usuário pode sobrescrever com uma imagem própria a qualquer momento.
export const SOCIAL_PLATFORMS = [
  "whatsapp",
  "instagram",
  "facebook",
  "twitter",
  "tiktok",
  "youtube",
  "email",
  "phone",
  "pin",
  "custom",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

// Fontes do Google Fonts disponíveis no editor de aparência.
// Para adicionar mais, basta incluir o nome exato como aparece no Google Fonts.
export const FONT_OPTIONS = [
  "Montserrat",
  "Roboto",
  "Poppins",
  "Inter",
  "Playfair Display",
  "Bebas Neue",
  "Space Grotesk",
  "DM Sans",
  "Sora",
  "Oswald",
] as const;
