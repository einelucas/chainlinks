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
    <div className="sticky top-20">
      <p className="text-xs text-neutral-500 mb-3 text-center">
        Preview em tempo real
      </p>
      <div className="mx-auto w-[300px] h-[620px] rounded-[2.5rem] border-[10px] border-neutral-800 bg-neutral-800 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-neutral-800 rounded-b-2xl z-10" />
        <div className="w-full h-full overflow-y-auto bg-black rounded-[2rem]">
          <PublicLinkPage theme={theme} links={links} socials={socials} isPreview />
        </div>
      </div>
    </div>
  );
}
