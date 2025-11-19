import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'monochrome';
  type?: 'icon' | 'full';
}

const Logo: React.FC<LogoProps> = ({ className, variant = 'color', type = 'icon' }) => {
  const isMonochrome = variant === 'monochrome';
  // Primary Dark (Deep Charcoal Teal) -> using app's #2d555d
  // Accent Gold (Muted Ochre Gold) -> using app's #c9a955
  const primaryColor = isMonochrome ? 'currentColor' : '#2d555d'; 
  const accentColor = isMonochrome ? 'currentColor' : '#c9a955';

  // Adjust viewBox based on type
  const viewBox = type === 'full' ? "0 0 400 100" : "0 0 100 100";

  return (
    <svg
      viewBox={viewBox}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Productiwise Logo"
    >
      {/* Icon Group */}
      <g transform={type === 'full' ? "translate(0, 10) scale(0.8)" : "translate(0, 0)"}>
        
        {/* 
          Subject: Human Profile (Female, Left-facing)
          Style: Solid silhouette, Flat Design.
          Description: Solid face shape with soft features. distinct gap (negative space) at back of head.
        */}
        <path
          d="M50 95 C 50 95, 40 92, 35 82 C 32 72, 28 70, 28 70 C 28 70, 22 66, 22 60 C 22 56, 26 54, 28 52 C 28 52, 27 45, 30 40 C 33 35, 42 28, 52 28 C 52 28, 58 28, 55 40 C 52 50, 48 60, 52 70 C 56 80, 60 90, 55 95 Z"
          fill={primaryColor}
        />

        {/* 
          Visual Elements: Branches
          Concept: Human-Nature Fusion.
          Shape: Curved, flowing lines extending upward/right.
        */}
        
        {/* Main Branch (Upper) */}
        <path
          d="M58 45 Q 65 30, 85 20"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Secondary Branch (Lower) */}
        <path
          d="M60 65 Q 75 65, 92 50"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* 
          Visual Elements: Foliage
          Shape: Simple geometric ellipses.
          Colors: Mix of Primary (Dark) and Accent (Gold).
        */}
        
        {/* Leaves on Upper Branch */}
        <ellipse cx="68" cy="32" rx="5" ry="3" transform="rotate(-40 68 32)" fill={accentColor} />
        <ellipse cx="80" cy="22" rx="6" ry="4" transform="rotate(-20 80 22)" fill={primaryColor} />
        
        {/* Leaves on Lower Branch */}
        <ellipse cx="72" cy="62" rx="5" ry="3" transform="rotate(-10 72 62)" fill={primaryColor} />
        <ellipse cx="85" cy="55" rx="6" ry="4" transform="rotate(-15 85 55)" fill={accentColor} />
        
        {/* Floating Leaf */}
        <ellipse cx="62" cy="52" rx="3" ry="2" transform="rotate(10 62 52)" fill={primaryColor} />

        {/* 
          Decorative Accents: Floating Dots
          Description: Small circular particles for texture and balance.
        */}
        <circle cx="62" cy="25" r="1.5" fill={primaryColor} />
        <circle cx="90" cy="30" r="2" fill={accentColor} />
        <circle cx="95" cy="60" r="1.5" fill={primaryColor} />
        <circle cx="52" cy="20" r="2" fill={accentColor} />

      </g>

      {/* Text for Full Logo */}
      {type === 'full' && (
        <g>
            <text
            x="110"
            y="60"
            fontFamily="'Dancing Script', cursive"
            fontWeight="700"
            fontSize="50"
            fill={primaryColor}
            >
            Productiwise
            </text>
            <text
            x="115"
            y="85"
            fontFamily="serif"
            fontWeight="400"
            fontSize="12"
            fill={primaryColor}
            letterSpacing="0.05em"
            >
            PLANNERS & PRODUCTIVITY
            </text>
        </g>
      )}
    </svg>
  );
};

export default Logo;