import {
  siWhatsapp,
  siInstagram,
  siFacebook,
  siX,
  siTiktok,
  siYoutube,
  siTelegram,
  siDiscord,
  siTwitch,
  siSnapchat,
  siPinterest,
  siReddit,
  siThreads,
  siMastodon,
  siBluesky,
  siVk,
  siLinktree,
  siPix,
  siNubank,
  siMercadopago,
  siPicpay,
  siPaypal,
  siStripe,
  siCashapp,
  siVenmo,
  siShopify,
  siEtsy,
  siAirbnb,
  siUber,
  siIfood,
  siWordpress,
  siWix,
  siSquarespace,
  siFiverr,
  siUpwork,
  siSpotify,
  siApplemusic,
  siSoundcloud,
  siDeezer,
  siTidal,
  siAudible,
  siBandcamp,
  siPatreon,
  siKofi,
  siBuymeacoffee,
  siGumroad,
  siOnlyfans,
  siNotion,
  siFigma,
  siZoom,
  siGooglemeet,
  siGithub,
  siGitlab,
  siDropbox,
  siGoogledrive,
  siIcloud,
  siSteam,
  siPlaystation,
  siEpicgames,
  siItchdotio,
  siApple,
  siGoogle,
  siGmail,
  siMailchimp,
  siRss,
  siMedium,
  siSubstack,
  siBehance,
  siDribbble,
  siImdb,
  siGoodreads,
  siLetterboxd,
  siStrava,
  siNike,
  siAdidas,
  siWechat,
  siLine,
  siKakaotalk,
  siVimeo,
  siGooglemaps,
  siWaze,
  siSignal,
} from "simple-icons";

export type IconColorMode = "color" | "black" | "white";

type SimpleIcon = { title: string; slug: string; path: string; hex: string };

export type IconLibraryEntry = {
  slug: string;
  title: string;
  path: string;
  hex: string;
};

type IconCategory = {
  label: string;
  icons: IconLibraryEntry[];
};

function entry(icon: SimpleIcon): IconLibraryEntry {
  return { slug: icon.slug, title: icon.title, path: icon.path, hex: `#${icon.hex}` };
}

export const ICON_CATEGORIES: IconCategory[] = [
  {
    label: "Redes sociais",
    icons: [
      siWhatsapp,
      siInstagram,
      siFacebook,
      siX,
      siTiktok,
      siYoutube,
      siTelegram,
      siDiscord,
      siTwitch,
      siSnapchat,
      siPinterest,
      siReddit,
      siThreads,
      siMastodon,
      siBluesky,
      siVk,
      siLinktree,
      siWechat,
      siLine,
      siKakaotalk,
      siVimeo,
    ].map(entry),
  },
  {
    label: "Pagamentos",
    icons: [siPix, siNubank, siMercadopago, siPicpay, siPaypal, siStripe, siCashapp, siVenmo].map(
      entry
    ),
  },
  {
    label: "Negócios e comércio",
    icons: [
      siShopify,
      siEtsy,
      siAirbnb,
      siUber,
      siIfood,
      siWordpress,
      siWix,
      siSquarespace,
      siFiverr,
      siUpwork,
    ].map(entry),
  },
  {
    label: "Streaming e música",
    icons: [siSpotify, siApplemusic, siSoundcloud, siDeezer, siTidal, siAudible, siBandcamp].map(
      entry
    ),
  },
  {
    label: "Apoio a criadores",
    icons: [siPatreon, siKofi, siBuymeacoffee, siGumroad, siOnlyfans].map(entry),
  },
  {
    label: "Produtividade",
    icons: [
      siNotion,
      siFigma,
      siZoom,
      siGooglemeet,
      siGithub,
      siGitlab,
      siDropbox,
      siGoogledrive,
      siIcloud,
    ].map(entry),
  },
  {
    label: "Jogos",
    icons: [siSteam, siPlaystation, siEpicgames, siItchdotio].map(entry),
  },
  {
    label: "Outros",
    icons: [
      siApple,
      siGoogle,
      siGmail,
      siMailchimp,
      siRss,
      siMedium,
      siSubstack,
      siBehance,
      siDribbble,
      siImdb,
      siGoodreads,
      siLetterboxd,
      siStrava,
      siNike,
      siAdidas,
      siGooglemaps,
      siWaze,
      siSignal,
    ].map(entry),
  },
];

export const ALL_ICONS: IconLibraryEntry[] = ICON_CATEGORIES.flatMap((c) => c.icons);

/** Monta um SVG autocontido e devolve como data-URI, no mesmo formato que o upload manual já produz. */
export function buildIconDataUrl(icon: IconLibraryEntry, mode: IconColorMode): string {
  const fill = mode === "color" ? icon.hex : mode === "black" ? "#000000" : "#ffffff";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${fill}" d="${icon.path}"/></svg>`;
  const base64 =
    typeof window === "undefined"
      ? Buffer.from(svg, "utf-8").toString("base64")
      : window.btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}
