"use client";

import { useState } from "react";
import type { LinkItemData, PageTheme, SocialIconData } from "@/lib/types";
import { PLATFORM_ICON_MAP, ShareIcon, QrIcon, CloseIcon, ChainIcon } from "@/components/icons";

type Props = {
  theme: PageTheme;
  links: LinkItemData[];
  socials: SocialIconData[];
  /** URL completa da página (usada nos botões de compartilhar/QR). Opcional no preview. */
  pageUrl?: string;
  /** Quando true, roda dentro do editor: desativa cliques reais em links e navegação. */
  isPreview?: boolean;
};

export default function PublicLinkPage({
  theme,
  links,
  socials,
  pageUrl,
  isPreview = false,
}: Props) {
  const [shareOpen, setShareOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const scopeId = "lp-" + theme.username.replace(/[^a-z0-9]/gi, "");

  const background =
    theme.bgType === "image" && theme.bgImage
      ? `url(${theme.bgImage}) no-repeat center/cover`
      : theme.bgType === "gradient"
      ? `linear-gradient(${theme.bgGradientAngle}deg, ${theme.bgGradientFrom}, ${theme.bgGradientTo})`
      : theme.bgColor;

  const activeLinks = links.filter((l) => l.isActive).sort((a, b) => a.order - b.order);
  const sortedSocials = [...socials].sort((a, b) => a.order - b.order);

  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    theme.fontFamily
  )}:wght@300;400;500;600;700&display=swap`;

  return (
    <>
      <link rel="stylesheet" href={fontUrl} />
      <div
      className={`${scopeId} lp-root`}
      style={
        {
          "--accent": theme.accentColor,
          "--text": theme.textColor,
          "--bio": theme.bioColor,
          "--btn-bg": theme.buttonBgColor,
          "--btn-border": theme.buttonBorderColor,
          "--btn-text": theme.buttonTextColor,
          "--btn-radius": `${theme.buttonRadius}px`,
          "--btn-shadow": theme.buttonShadowColor,
          "--hover-bg": theme.hoverBgColor,
          "--hover-glow": theme.hoverGlowColor,
          "--hover-scale": theme.hoverScale,
          "--font": theme.fontFamily,
          background,
          fontFamily: `"${theme.fontFamily}", sans-serif`,
        } as React.CSSProperties
      }
    >
      <div
        className="lp-overlay"
        style={{ background: `rgba(0,0,0,${theme.overlayOpacity})` }}
      />

      {theme.showShareButton && (
        <button
          type="button"
          className="lp-fab lp-fab-right"
          onClick={() => setShareOpen(true)}
          aria-label="Compartilhar"
        >
          <ShareIcon width={18} height={18} />
        </button>
      )}

      {theme.showQrButton && (
        <button
          type="button"
          className="lp-fab lp-fab-left"
          onClick={() => setQrOpen(true)}
          aria-label="QR Code"
        >
          <QrIcon width={18} height={18} />
        </button>
      )}

      <div className="lp-container">
        {theme.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={theme.profileImage} alt={theme.displayName} className="lp-profile-img" />
        ) : (
          <div className="lp-profile-img lp-profile-placeholder">
            {theme.displayName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <h1 className="lp-name">{theme.displayName}</h1>
        {theme.bio && <p className="lp-bio">{theme.bio}</p>}

        <div className="lp-links">
          {activeLinks.length === 0 && isPreview && (
            <p className="lp-empty">Adicione links na aba &quot;Links&quot; →</p>
          )}
          {activeLinks.map((link) => (
            <a
              key={link.id}
              href={isPreview ? undefined : link.url}
              target={isPreview ? undefined : "_blank"}
              rel={isPreview ? undefined : "noreferrer"}
              onClick={(e) => {
                if (isPreview) e.preventDefault();
              }}
              className="lp-link-card"
            >
              <span className="lp-link-icon">
                {link.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={link.icon} alt="" />
                ) : (
                  <ChainIcon width={20} height={20} />
                )}
              </span>
              {link.label}
            </a>
          ))}
        </div>

        {sortedSocials.length > 0 && (
          <div className="lp-social-buttons">
            {sortedSocials.map((s) => {
              const Icon = PLATFORM_ICON_MAP[s.platform] ?? PLATFORM_ICON_MAP.custom;
              return (
                <a
                  key={s.id}
                  href={isPreview ? undefined : s.url}
                  target={isPreview ? undefined : "_blank"}
                  rel={isPreview ? undefined : "noreferrer"}
                  onClick={(e) => {
                    if (isPreview) e.preventDefault();
                  }}
                  className="lp-footer-icon"
                >
                  {s.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.icon} alt={s.platform} />
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
        <div className="lp-modal-backdrop" onClick={() => setShareOpen(false)}>
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lp-close-btn" onClick={() => setShareOpen(false)}>
              <CloseIcon width={16} height={16} />
            </button>
            <h2>Compartilhar</h2>
            <p className="lp-modal-sub">{pageUrl ?? `/${theme.username}`}</p>
          </div>
        </div>
      )}

      {qrOpen && (
        <div className="lp-modal-backdrop" onClick={() => setQrOpen(false)}>
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lp-close-btn" onClick={() => setQrOpen(false)}>
              <CloseIcon width={16} height={16} />
            </button>
            <h2>Escaneie o QR Code</h2>
            <p className="lp-modal-sub">{pageUrl ?? `/${theme.username}`}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .lp-root {
          position: relative;
          min-height: ${isPreview ? "100%" : "100dvh"};
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 48px;
          overflow: hidden;
          color: var(--text);
        }
        .lp-overlay {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .lp-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          padding: 24px;
          text-align: center;
        }
        .lp-profile-img {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 16px;
          box-shadow: 0 0 35px var(--hover-glow);
          display: block;
        }
        .lp-profile-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--btn-bg);
          border: 1.5px solid var(--accent);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--accent);
        }
        .lp-name {
          font-size: 1.7rem;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }
        .lp-bio {
          font-size: 0.95rem;
          color: var(--bio);
          margin-bottom: 28px;
          line-height: 1.4;
        }
        .lp-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .lp-empty {
          color: var(--bio);
          font-size: 0.85rem;
          font-style: italic;
        }
        .lp-link-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px 20px;
          border-radius: var(--btn-radius);
          background: var(--btn-bg);
          border: 1.5px solid var(--btn-border);
          color: var(--btn-text);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          backdrop-filter: blur(6px);
          box-shadow: 0 0 20px var(--btn-shadow);
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .lp-link-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          opacity: 0.85;
        }
        .lp-link-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .lp-link-card:hover {
          background: var(--hover-bg);
          box-shadow: 0 0 35px var(--hover-glow);
          transform: scale(var(--hover-scale));
        }
        .lp-social-buttons {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 18px;
        }
        .lp-footer-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          opacity: 0.55;
          color: var(--text);
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .lp-footer-icon img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .lp-footer-icon:hover {
          opacity: 1;
          transform: scale(1.15);
          color: var(--accent);
        }
        .lp-fab {
          position: absolute;
          top: 16px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid var(--accent);
          background: var(--btn-bg);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
          color: var(--text);
          opacity: 0.75;
          transition: all 0.2s ease;
        }
        .lp-fab:hover {
          opacity: 1;
          box-shadow: 0 0 20px var(--hover-glow);
        }
        .lp-fab-right {
          right: 16px;
        }
        .lp-fab-left {
          left: 16px;
        }
        .lp-modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
        }
        .lp-modal {
          position: relative;
          width: 85%;
          max-width: 320px;
          padding: 24px;
          border-radius: 20px;
          background: rgba(0, 0, 0, 0.85);
          border: 1.5px solid var(--accent);
          backdrop-filter: blur(14px);
          text-align: center;
          color: var(--text);
        }
        .lp-modal h2 {
          font-size: 16px;
          margin-bottom: 10px;
        }
        .lp-modal-sub {
          font-size: 12px;
          color: var(--bio);
          word-break: break-all;
        }
        .lp-close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--accent);
          background: transparent;
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      `}</style>
    </div>
    </>
  );
}
