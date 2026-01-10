import { FC } from "react";
import koreanFlagImg from "@/assets/korean-flag.png";

interface IconProps {
  className?: string;
}

// Korean Flag using uploaded image
export const KoreanFlag: FC<IconProps> = ({ className }) => (
  <img 
    src={koreanFlagImg} 
    alt="Korean Flag" 
    className={className}
    loading="lazy"
  />
);

// Mini version for inline use
export const KoreanFlagMini: FC<IconProps> = ({ className }) => (
  <img 
    src={koreanFlagImg} 
    alt="🇰🇷" 
    className={`${className} rounded-sm shadow-sm`}
    loading="lazy"
  />
);
