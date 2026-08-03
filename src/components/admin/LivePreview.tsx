"use client";

import type { LinkItemData, PageTheme, SocialIconData } from "@/lib/types";
import PublicLinkPage from "@/components/PublicLinkPage";
import { DeviceIcon, EyeIcon } from "./AdminIcons";

type Props = {
  theme: PageTheme;
  links: LinkItemData[];
  socials: SocialIconData[];
  embedded?: boolean;
};

export default function LivePreview({ theme, links, socials, embedded = false }: Props) {
  return (
    <div className={`live-preview ${embedded ? "is-embedded" : ""}`}>
      {!embedded && (
        <div className="live-preview-toolbar">
          <div>
            <span className="live-preview-title"><EyeIcon /> Preview ao vivo</span>
            <small>linkpage.com/{theme.username}</small>
          </div>
          <span className="live-preview-device"><DeviceIcon /> Mobile</span>
        </div>
      )}

      <div className="live-preview-stage">
        <div className="live-preview-glow" aria-hidden="true" />
        <div className="live-preview-phone">
          <div className="live-preview-speaker" aria-hidden="true" />
          <div className="live-preview-screen">
            <div className="live-preview-content">
              <PublicLinkPage
                theme={theme}
                links={links}
                socials={socials}
                isPreview
              />
            </div>
          </div>
          <div className="live-preview-home" aria-hidden="true" />
        </div>
      </div>

      {!embedded && (
        <p className="live-preview-note">
          <span /> Alterações refletidas automaticamente
        </p>
      )}
    </div>
  );
}
