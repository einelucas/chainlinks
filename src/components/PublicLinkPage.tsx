"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import type {
  ButtonSize,
  LinkItemData,
  PageTheme,
  SocialIconData,
} from "@/lib/types";
import {
  PLATFORM_ICON_MAP,
  ShareIcon,
  QrIcon,
  CloseIcon,
  ChainIcon,
} from "@/components/icons";
import styles from "./PublicLinkPage.module.css";

type Props = {
  theme: PageTheme;
  links: LinkItemData[];
  socials: SocialIconData[];
  pageUrl?: string;
  isPreview?: boolean;
};

type ThemeStyle = CSSProperties & {
  "--accent": string;
  "--text": string;
  "--bio": string;
  "--btn-bg": string;
  "--btn-border": string;
  "--btn-text": string;
  "--btn-radius": string;
  "--btn-shadow": string;
  "--btn-padding-y": string;
  "--btn-padding-x": string;
  "--btn-min-height": string;
  "--hover-bg": string;
  "--hover-glow": string;
  "--hover-scale": number;
  "--font": string;
};

const BUTTON_SIZE_STYLE: Record<
  ButtonSize,
  { paddingY: string; paddingX: string; minHeight: string }
> = {
  small: { paddingY: "10px", paddingX: "16px", minHeight: "42px" },
  medium: { paddingY: "15px", paddingX: "20px", minHeight: "52px" },
  large: { paddingY: "20px", paddingX: "24px", minHeight: "64px" },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeFontFamily(fontFamily: string): string {
  const trimmed = fontFamily.trim();
  return trimmed || "Arial";
}

function normalizeButtonSize(buttonSize: string | undefined): ButtonSize {
  if (buttonSize === "small" || buttonSize === "large") return buttonSize;
  return "medium";
}

function getGoogleFontUrl(fontFamily: string): string {
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    fontFamily
  )}:wght@300;400;500;600;700&display=swap`;
}

export default function PublicLinkPage({
  theme,
  links,
  socials,
  pageUrl,
  isPreview = false,
}: Props) {
  const [shareOpen, setShareOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const fontFamily = normalizeFontFamily(theme.fontFamily);
  const fontSize = clamp(Number.isFinite(theme.fontSize) ? theme.fontSize : 16, 12, 24);
  const buttonRadius = clamp(
    Number.isFinite(theme.buttonRadius) ? theme.buttonRadius : 50,
    0,
    50
  );
  const buttonSize = normalizeButtonSize(theme.buttonSize);
  const buttonMetrics = BUTTON_SIZE_STYLE[buttonSize];

  useEffect(() => {
    const fontId = `chainlinks-font-${fontFamily
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}`;

    if (document.getElementById(fontId)) return;

    const fontLink = document.createElement("link");
    fontLink.id = fontId;
    fontLink.rel = "stylesheet";
    fontLink.href = getGoogleFontUrl(fontFamily);
    document.head.appendChild(fontLink);
  }, [fontFamily]);

  const background =
    theme.bgType === "image" && theme.bgImage
      ? `url(${theme.bgImage}) no-repeat center/cover`
      : theme.bgType === "gradient"
        ? `linear-gradient(${theme.bgGradientAngle}deg, ${theme.bgGradientFrom}, ${theme.bgGradientTo})`
        : theme.bgColor;

  const activeLinks = useMemo(
    () =>
      links
        .filter((link) => link.isActive)
        .sort((a, b) => a.order - b.order),
    [links]
  );

  const sortedSocials = useMemo(
    () => [...socials].sort((a, b) => a.order - b.order),
    [socials]
  );

  const themeStyle: ThemeStyle = {
    "--accent": theme.accentColor,
    "--text": theme.textColor,
    "--bio": theme.bioColor,
    "--btn-bg": theme.buttonBgColor,
    "--btn-border": theme.buttonBorderColor,
    "--btn-text": theme.buttonTextColor,
    "--btn-radius": `${buttonRadius}px`,
    "--btn-shadow": theme.buttonShadowColor,
    "--btn-padding-y": buttonMetrics.paddingY,
    "--btn-padding-x": buttonMetrics.paddingX,
    "--btn-min-height": buttonMetrics.minHeight,
    "--hover-bg": theme.hoverBgColor,
    "--hover-glow": theme.hoverGlowColor,
    "--hover-scale": theme.hoverScale,
    "--font": fontFamily,
    background,
    fontFamily: `"${fontFamily}", sans-serif`,
    fontSize: `${fontSize}px`,
  };

  function blockPreviewNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (isPreview) event.preventDefault();
  }

  return (
    <div
      className={`${styles.root} ${isPreview ? styles.preview : styles.published}`}
      style={themeStyle}
    >
      <div
        className={styles.overlay}
        style={{ background: `rgba(0, 0, 0, ${theme.overlayOpacity})` }}
      />

      {theme.showShareButton && (
        <button
          type="button"
          className={`${styles.fab} ${styles.fabRight}`}
          onClick={() => setShareOpen(true)}
          aria-label="Compartilhar"
        >
          <ShareIcon width={18} height={18} />
        </button>
      )}

      {theme.showQrButton && (
        <button
          type="button"
          className={`${styles.fab} ${styles.fabLeft}`}
          onClick={() => setQrOpen(true)}
          aria-label="QR Code"
        >
          <QrIcon width={18} height={18} />
        </button>
      )}

      <div className={styles.container}>
        {theme.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={theme.profileImage}
            alt={theme.displayName}
            className={styles.profileImage}
          />
        ) : (
          <div className={`${styles.profileImage} ${styles.profilePlaceholder}`}>
            {(theme.displayName || theme.username || "?")
              .slice(0, 1)
              .toUpperCase()}
          </div>
        )}

        <h1 className={styles.name}>{theme.displayName}</h1>
        {theme.bio && <p className={styles.bio}>{theme.bio}</p>}

        <div className={styles.links}>
          {activeLinks.length === 0 && isPreview && (
            <p className={styles.empty}>
              Adicione links na aba &quot;Links&quot; →
            </p>
          )}

          {activeLinks.map((link) => (
            <a
              key={link.id}
              href={isPreview ? undefined : link.url}
              target={isPreview ? undefined : "_blank"}
              rel={isPreview ? undefined : "noreferrer"}
              onClick={blockPreviewNavigation}
              className={styles.linkCard}
            >
              <span className={styles.linkIcon}>
                {link.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={link.icon} alt="" />
                ) : (
                  <ChainIcon width={20} height={20} />
                )}
              </span>
              <span className={styles.linkLabel}>{link.label}</span>
            </a>
          ))}
        </div>

        {sortedSocials.length > 0 && (
          <div className={styles.socialButtons}>
            {sortedSocials.map((social) => {
              const Icon =
                PLATFORM_ICON_MAP[social.platform] ?? PLATFORM_ICON_MAP.custom;

              return (
                <a
                  key={social.id}
                  href={isPreview ? undefined : social.url}
                  target={isPreview ? undefined : "_blank"}
                  rel={isPreview ? undefined : "noreferrer"}
                  onClick={blockPreviewNavigation}
                  className={styles.footerIcon}
                  aria-label={social.platform}
                >
                  {social.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={social.icon} alt={social.platform} />
                  ) : (
                    <Icon width={22} height={22} />
                  )}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {shareOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setShareOpen(false)}
          role="presentation"
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setShareOpen(false)}
              aria-label="Fechar"
            >
              <CloseIcon width={16} height={16} />
            </button>
            <h2 id="share-dialog-title">Compartilhar</h2>
            <p className={styles.modalSubtitle}>
              {pageUrl ?? `/${theme.username}`}
            </p>
          </div>
        </div>
      )}

      {qrOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setQrOpen(false)}
          role="presentation"
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-dialog-title"
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setQrOpen(false)}
              aria-label="Fechar"
            >
              <CloseIcon width={16} height={16} />
            </button>
            <h2 id="qr-dialog-title">Escaneie o QR Code</h2>
            <p className={styles.modalSubtitle}>
              {pageUrl ?? `/${theme.username}`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
