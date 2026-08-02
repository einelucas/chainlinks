import type { SVGProps } from "react";

// Ícones simples em linha (stroke), para servir de padrão quando o usuário
// não fizer upload de um ícone customizado para o link/rede social.

const base = (props: SVGProps<SVGSVGElement>) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M3 21l1.65-4.95A8.5 8.5 0 1 1 8.9 19.4L3 21z" />
      <path d="M8.5 9.5c0 3 3 6 6 6 .8 0 1-1.5.5-2s-1.5-1-1.8-.5-.7.7-1.2.4c-1-.5-2.4-1.9-2.9-2.9-.3-.5.1-.9.4-1.2s0-1.3-.5-1.8-2-.3-2 .5c0 .5.1 1 .1 1.5" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V9z" />
    </svg>
  );
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M4 4l7.5 9.5L4.5 20H7l5.2-5.9L16.5 20H20l-8-10 6.5-6h-2.5l-4.7 5.4L8 4H4z" />
    </svg>
  );
}

export function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M14 4v9.5a3 3 0 1 1-2.2-2.9" />
      <path d="M14 4c0 2.5 2 4.5 4.5 4.5" />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function EmailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 6.5l9 6 9-6" />
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1 .4 2.2.6 3.3.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4.3c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.3.6 3.3.1.4 0 .8-.2 1L6.6 10.8z" />
    </svg>
  );
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s7-6.5 7-11.5a7 7 0 1 0-14 0C5 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function LinkIconGeneric(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M9 15l6-6" />
      <path d="M10 6.5l1-1a3.5 3.5 0 1 1 5 5l-1 1" />
      <path d="M14 17.5l-1 1a3.5 3.5 0 1 1-5-5l1-1" />
    </svg>
  );
}

export function ChainIcon(props: SVGProps<SVGSVGElement>) {
  return <LinkIconGeneric {...props} />;
}

export function ShareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4" />
    </svg>
  );
}

export function QrIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export const PLATFORM_ICON_MAP: Record<
  string,
  (props: SVGProps<SVGSVGElement>) => React.JSX.Element
> = {
  whatsapp: WhatsappIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  tiktok: TiktokIcon,
  youtube: YoutubeIcon,
  email: EmailIcon,
  phone: PhoneIcon,
  pin: PinIcon,
  custom: LinkIconGeneric,
};
