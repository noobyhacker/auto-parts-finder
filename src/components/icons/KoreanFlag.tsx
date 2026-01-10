import { FC } from "react";

interface IconProps {
  className?: string;
}

export const KoreanFlag: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
    {/* White background */}
    <rect fill="#FFFFFF" width="900" height="600"/>
    
    {/* Taeguk (Yin-Yang) */}
    <circle cx="450" cy="300" r="150" fill="#C60C30"/>
    <path d="M450,300 A75,75 0 0,1 450,150 A75,75 0 0,0 450,300" fill="#003478"/>
    <path d="M450,300 A75,75 0 0,1 450,450 A75,75 0 0,0 450,300" fill="#C60C30"/>
    <circle cx="450" cy="225" r="75" fill="#C60C30"/>
    <circle cx="450" cy="375" r="75" fill="#003478"/>
    
    {/* Trigrams - simplified */}
    {/* Top left - Geon (Heaven) */}
    <g transform="translate(225, 140) rotate(-56.31)">
      <rect x="0" y="0" width="100" height="12" fill="#000"/>
      <rect x="0" y="24" width="100" height="12" fill="#000"/>
      <rect x="0" y="48" width="100" height="12" fill="#000"/>
    </g>
    
    {/* Bottom right - Gon (Earth) */}
    <g transform="translate(595, 460) rotate(-56.31)">
      <rect x="0" y="0" width="44" height="12" fill="#000"/>
      <rect x="56" y="0" width="44" height="12" fill="#000"/>
      <rect x="0" y="24" width="44" height="12" fill="#000"/>
      <rect x="56" y="24" width="44" height="12" fill="#000"/>
      <rect x="0" y="48" width="44" height="12" fill="#000"/>
      <rect x="56" y="48" width="44" height="12" fill="#000"/>
    </g>
    
    {/* Top right - Gam (Water) */}
    <g transform="translate(595, 140) rotate(56.31)">
      <rect x="0" y="0" width="44" height="12" fill="#000"/>
      <rect x="56" y="0" width="44" height="12" fill="#000"/>
      <rect x="0" y="24" width="100" height="12" fill="#000"/>
      <rect x="0" y="48" width="44" height="12" fill="#000"/>
      <rect x="56" y="48" width="44" height="12" fill="#000"/>
    </g>
    
    {/* Bottom left - Ri (Fire) */}
    <g transform="translate(225, 460) rotate(56.31)">
      <rect x="0" y="0" width="100" height="12" fill="#000"/>
      <rect x="0" y="24" width="44" height="12" fill="#000"/>
      <rect x="56" y="24" width="44" height="12" fill="#000"/>
      <rect x="0" y="48" width="100" height="12" fill="#000"/>
    </g>
  </svg>
);

// Simplified mini version for inline use
export const KoreanFlagMini: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
    <rect fill="#FFFFFF" width="30" height="20" rx="2"/>
    <circle cx="15" cy="10" r="5" fill="#C60C30"/>
    <path d="M15,10 A2.5,2.5 0 0,1 15,5 A2.5,2.5 0 0,0 15,10" fill="#003478"/>
    <circle cx="15" cy="7.5" r="2.5" fill="#C60C30"/>
    <circle cx="15" cy="12.5" r="2.5" fill="#003478"/>
  </svg>
);
