// Custom SVG icons for categories - no emojis
import { FC } from "react";

interface IconProps {
  className?: string;
}

export const EngineIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const BrakeIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

export const SuspensionIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16M4 4v2l2 2-2 2 2 2-2 2 2 2v2M20 4v2l-2 2 2 2-2 2 2 2-2 2v2M4 20h16" />
    <circle cx="8" cy="20" r="2" />
    <circle cx="16" cy="20" r="2" />
  </svg>
);

export const FilterIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 7h10M7 12h10M7 17h10" strokeDasharray="2 2" />
    <path d="M6 8v8M18 8v8" />
  </svg>
);

export const ElectricalIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="none" />
  </svg>
);

export const BodyIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17h14M3 12l2-6h14l2 6M5 17a2 2 0 100-4M19 17a2 2 0 100-4M5 13H3v4h2M19 13h2v4h-2" />
    <path d="M7 6l1-3h8l1 3" />
  </svg>
);

export const CoolingIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 12h20M12 2l4 4M12 2l-4 4M12 22l4-4M12 22l-4-4M2 12l4 4M2 12l4-4M22 12l-4 4M22 12l-4-4" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const TransmissionIcon: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="6" r="2" />
    <circle cx="12" cy="6" r="2" />
    <circle cx="19" cy="6" r="2" />
    <circle cx="5" cy="18" r="2" />
    <circle cx="12" cy="18" r="2" />
    <path d="M5 8v8M12 8v8M19 8v10a2 2 0 01-2 2h-3" />
  </svg>
);

export const categoryIcons = {
  "engine-parts": EngineIcon,
  "brake-system": BrakeIcon,
  "suspension": SuspensionIcon,
  "filters": FilterIcon,
  "electrical": ElectricalIcon,
  "body-parts": BodyIcon,
  "cooling-system": CoolingIcon,
  "transmission": TransmissionIcon,
} as const;
