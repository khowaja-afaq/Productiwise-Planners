
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'monochrome';
  type?: 'icon' | 'full';
}

const Logo: React.FC<LogoProps> = ({ className, variant = 'color', type = 'icon' }) => {
  const isMonochrome = variant === 'monochrome';
  const color = isMonochrome ? 'currentColor' : '#2d555d'; // Primary color

  if (type === 'full') {
    return (
      <svg
        viewBox="0 0 600 160"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Productiwise Logo"
      >
        <text
          x="300"
          y="100"
          textAnchor="middle"
          fontFamily="'Dancing Script', cursive"
          fontWeight="700"
          fontSize="100"
          fill={color}
        >
          Productiwise
        </text>
        <text
          x="300"
          y="140"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="24"
          fontWeight="bold"
          letterSpacing="1"
          fill={color}
        >
          Planners and Productivity
        </text>
      </svg>
    );
  }

  // Icon mode (just the P)
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Productiwise Icon"
    >
      <text
        x="60"
        y="90"
        textAnchor="middle"
        fontFamily="'Dancing Script', cursive"
        fontWeight="700"
        fontSize="110"
        fill={color}
      >
        P
      </text>
    </svg>
  );
};

export default Logo;
