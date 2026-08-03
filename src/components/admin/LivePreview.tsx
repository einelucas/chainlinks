"use client";

import type { LinkItemData, PageTheme, SocialIconData } from "@/lib/types";
import PublicLinkPage from "@/components/PublicLinkPage";

type Props = {
  theme: PageTheme;
  links: LinkItemData[];
  socials: SocialIconData[];
};

export default function LivePreview({ theme, links, socials }: Props) {
  return (
    <div className="xl:sticky xl:top-20">
      <div className="mb-3 text-center">
        <p className="text-xs text-neutral-400">Preview responsivo</p>
        <p className="mt-1 text-[11px] text-neutral-600">
          A página publicada ocupa a largura disponível do dispositivo.
        </p>
      </div>

      <div className="mx-auto h-[680px] min-h-[520px] max-h-[78dvh] w-full max-w-[390px] overflow-hidden rounded-[2.5rem] border-[8px] border-neutral-800 bg-neutral-800 shadow-2xl sm:border-[10px]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-black sm:rounded-[2rem]">
          <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-neutral-800 sm:w-28" />
          <div className="h-full w-full overflow-y-auto overscroll-contain">
            <PublicLinkPage
              theme={theme}
              links={links}
              socials={socials}
              isPreview
            />
          </div>
        </div>
      </div>
    </div>
  );
}
