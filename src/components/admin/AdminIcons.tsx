import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function iconProps(props: IconProps) {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function LinksIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M10.2 13.8a4 4 0 0 0 5.7 0l2.7-2.7a4 4 0 0 0-5.7-5.7l-1.5 1.5" />
      <path d="M13.8 10.2a4 4 0 0 0-5.7 0l-2.7 2.7a4 4 0 0 0 5.7 5.7l1.5-1.5" />
    </svg>
  );
}

export function SocialIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.3 10.8 7.4-4.4M8.3 13.2l7.4 4.4" />
    </svg>
  );
}

export function PaletteIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 3a9 9 0 0 0 0 18h1.4a1.7 1.7 0 0 0 1.3-2.8 1.7 1.7 0 0 1 1.3-2.8h1.2A3.8 3.8 0 0 0 21 11.6 8.8 8.8 0 0 0 12 3Z" />
      <circle cx="7.5" cy="11" r=".8" fill="currentColor" stroke="none" />
      <circle cx="10" cy="7.5" r=".8" fill="currentColor" stroke="none" />
      <circle cx="14.3" cy="7.2" r=".8" fill="currentColor" stroke="none" />
      <circle cx="17" cy="10.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ProfileIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export function DeviceIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
      <path d="M10.5 18.5h3" />
    </svg>
  );
}

export function DesktopIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

export function LogoutIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5" />
      <path d="m15 8 4 4-4 4M19 12H9" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13M10 11v5M14 11v5" />
    </svg>
  );
}

export function GripIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="9" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 16V4M7.5 8.5 12 4l4.5 4.5" />
      <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m4 17 5-5 4 4 2.5-2.5L20 18" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function SpinnerIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M21 12a9 9 0 1 1-3.3-7" />
    </svg>
  );
}

export function BackgroundIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="m4 16 5-5 4 4 3-3 4 4" />
    </svg>
  );
}

export function TypeIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M5 5h14M12 5v14M8.5 19h7" />
    </svg>
  );
}

export function ButtonIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="7" width="18" height="10" rx="5" />
      <path d="M9 12h6" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="m12 3 1.1 3.1L16 7.5l-2.9 1.4L12 12l-1.1-3.1L8 7.5l2.9-1.4L12 3Z" />
      <path d="m18.5 13 .7 2 1.8.9-1.8.9-.7 2-.7-2-1.8-.9 1.8-.9.7-2ZM6 14l.8 2.2L9 17.3l-2.2 1.1L6 20.5l-.8-2.1L3 17.3l2.2-1.1L6 14Z" />
    </svg>
  );
}

export function CloseAdminIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
