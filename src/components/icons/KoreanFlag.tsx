import { FC } from "react";

interface IconProps {
  className?: string;
}

// Proper Korean Flag (Taegeukgi)
export const KoreanFlag: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
    {/* White background */}
    <rect fill="#FFFFFF" width="900" height="600"/>
    
    {/* Taeguk - Red top, Blue bottom */}
    <circle cx="450" cy="300" r="150" fill="#CD2E3A"/>
    <path d="M450,300 c0,-82.84 67.16,-150 150,-150 c0,82.84 -67.16,150 -150,150" fill="#CD2E3A"/>
    <path d="M450,300 c0,82.84 -67.16,150 -150,150 c0,-82.84 67.16,-150 150,-150" fill="#0047A0"/>
    <circle cx="525" cy="225" r="75" fill="#CD2E3A"/>
    <circle cx="375" cy="375" r="75" fill="#0047A0"/>
    
    {/* Trigrams */}
    {/* Geon - Top Left (Heaven) - 3 solid bars */}
    <g transform="rotate(-56.31 450 300)">
      <rect x="150" y="190" width="110" height="16" fill="#000"/>
      <rect x="150" y="218" width="110" height="16" fill="#000"/>
      <rect x="150" y="246" width="110" height="16" fill="#000"/>
    </g>
    
    {/* Gon - Bottom Right (Earth) - 3 broken bars */}
    <g transform="rotate(-56.31 450 300)">
      <rect x="640" y="338" width="50" height="16" fill="#000"/>
      <rect x="700" y="338" width="50" height="16" fill="#000"/>
      <rect x="640" y="366" width="50" height="16" fill="#000"/>
      <rect x="700" y="366" width="50" height="16" fill="#000"/>
      <rect x="640" y="394" width="50" height="16" fill="#000"/>
      <rect x="700" y="394" width="50" height="16" fill="#000"/>
    </g>
    
    {/* Gam - Top Right (Water) */}
    <g transform="rotate(56.31 450 300)">
      <rect x="640" y="190" width="50" height="16" fill="#000"/>
      <rect x="700" y="190" width="50" height="16" fill="#000"/>
      <rect x="640" y="218" width="110" height="16" fill="#000"/>
      <rect x="640" y="246" width="50" height="16" fill="#000"/>
      <rect x="700" y="246" width="50" height="16" fill="#000"/>
    </g>
    
    {/* Ri - Bottom Left (Fire) */}
    <g transform="rotate(56.31 450 300)">
      <rect x="150" y="338" width="110" height="16" fill="#000"/>
      <rect x="150" y="366" width="50" height="16" fill="#000"/>
      <rect x="210" y="366" width="50" height="16" fill="#000"/>
      <rect x="150" y="394" width="110" height="16" fill="#000"/>
    </g>
  </svg>
);

// Mini version for inline use - simplified but accurate
export const KoreanFlagMini: FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
    <rect fill="#FFFFFF" width="36" height="24" rx="2"/>
    {/* Taeguk */}
    <circle cx="18" cy="12" r="6" fill="#CD2E3A"/>
    <path d="M18,12 a3,3 0 0,1 3,-3 a3,3 0 0,0 -3,3" fill="#CD2E3A"/>
    <path d="M18,12 a3,3 0 0,1 -3,3 a3,3 0 0,0 3,-3" fill="#0047A0"/>
    <circle cx="21" cy="9" r="3" fill="#CD2E3A"/>
    <circle cx="15" cy="15" r="3" fill="#0047A0"/>
    {/* Simplified trigram hints */}
    <rect x="5" y="5" width="6" height="1.5" fill="#000" transform="rotate(-55 8 6)"/>
    <rect x="25" y="17" width="6" height="1.5" fill="#000" transform="rotate(-55 28 18)"/>
    <rect x="25" y="5" width="6" height="1.5" fill="#000" transform="rotate(55 28 6)"/>
    <rect x="5" y="17" width="6" height="1.5" fill="#000" transform="rotate(55 8 18)"/>
  </svg>
);
