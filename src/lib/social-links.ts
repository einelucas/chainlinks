// Constrói o link final de alguns canais a partir do que o usuário digita,
// evitando que ele precise montar a URL (wa.me, tel:, mailto:) manualmente.

const BRAZIL_COUNTRY_CODE = "55";

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function withCountryCode(digits: string): string {
  return digits.startsWith(BRAZIL_COUNTRY_CODE) ? digits : `${BRAZIL_COUNTRY_CODE}${digits}`;
}

/** Monta a URL salva a partir do que o usuário digitou no campo do canal. */
export function buildChannelUrl(platform: string, rawInput: string): string {
  const trimmed = rawInput.trim();
  if (!trimmed) return trimmed;

  if (platform === "whatsapp") {
    return `https://wa.me/${withCountryCode(onlyDigits(trimmed))}`;
  }
  if (platform === "phone") {
    return `tel:+${withCountryCode(onlyDigits(trimmed))}`;
  }
  if (platform === "email") {
    return trimmed.startsWith("mailto:") ? trimmed : `mailto:${trimmed}`;
  }
  return trimmed;
}

/** Extrai de volta o que deve aparecer no campo de edição, a partir da URL salva. */
export function extractChannelInput(platform: string, url: string): string {
  if (platform === "whatsapp" || platform === "phone") {
    const digits = onlyDigits(url);
    return digits.startsWith(BRAZIL_COUNTRY_CODE) ? digits.slice(BRAZIL_COUNTRY_CODE.length) : digits;
  }
  if (platform === "email") {
    return url.replace(/^mailto:/, "");
  }
  return url;
}
