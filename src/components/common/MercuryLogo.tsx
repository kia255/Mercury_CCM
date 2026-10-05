import React from 'react';

interface MercuryLogoProps {
  className?: string;
  variant?: 'full' | 'mark';
  colorMode?: 'dark' | 'light'; // dark = for light bg (dark teal + coral), light = for dark bg (white + coral)
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
}

/**
 * MERCURY Official Brand Logo Component
 * Viewfinder reticle with colorimetric reagent droplet (coral liquid meniscus)
 * and stacked "Mer / cury" typography.
 */
export const MercuryLogo: React.FC<MercuryLogoProps> = ({
  className = '',
  variant = 'full',
  colorMode = 'dark',
  size = 'md'
}) => {
  const isLightMode = colorMode === 'light';
  const strokeColor = isLightMode ? '#FFFFFF' : '#1C353D';
  const textColor = isLightMode ? '#FFFFFF' : '#1C353D';
  const dropletUpperColor = isLightMode ? '#335C67' : '#1C353D';
  const coralColor = '#E07D74'; // Reagent fluid coral
  const circleStroke = isLightMode ? 'rgba(255, 255, 255, 0.85)' : '#1C353D';

  // Sizing helpers
  let height = 40;
  if (typeof size === 'number') {
    height = size;
  } else {
    switch (size) {
      case 'sm':
        height = 28;
        break;
      case 'md':
        height = 40;
        break;
      case 'lg':
        height = 56;
        break;
      case 'xl':
        height = 76;
        break;
    }
  }

  // Aspect ratios:
  // 'mark': square 1:1 (viewBox "0 0 520 520")
  // 'full': ~2.05:1 (viewBox "0 0 1060 520")

  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 520 520"
        height={height}
        width={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 select-none ${className}`}
        aria-label="MERCURY Logo"
      >
        <MercuryMarkSvg
          strokeColor={strokeColor}
          dropletUpperColor={dropletUpperColor}
          coralColor={coralColor}
          circleStroke={circleStroke}
        />
      </svg>
    );
  }

  const width = Math.round(height * 2.05);

  return (
    <svg
      viewBox="0 0 1060 520"
      height={height}
      width={width}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
      aria-label="MERCURY Logo"
    >
      {/* Viewfinder Mark on Left (0 - 500) */}
      <MercuryMarkSvg
        strokeColor={strokeColor}
        dropletUpperColor={dropletUpperColor}
        coralColor={coralColor}
        circleStroke={circleStroke}
      />

      {/* Wordmark on Right: "Mer" / "cury" */}
      <g fill={textColor}>
        {/* Line 1: "Mer" */}
        <text
          x="525"
          y="235"
          fontFamily="Plus Jakarta Sans, Inter, system-ui, -apple-system, sans-serif"
          fontSize="248"
          fontWeight="800"
          letterSpacing="-0.03em"
        >
          Mer
        </text>

        {/* Line 2: "cury" */}
        <text
          x="515"
          y="442"
          fontFamily="Plus Jakarta Sans, Inter, system-ui, -apple-system, sans-serif"
          fontSize="248"
          fontWeight="800"
          letterSpacing="-0.03em"
        >
          cury
        </text>
      </g>
    </svg>
  );
};

interface MercuryMarkSvgProps {
  strokeColor: string;
  dropletUpperColor: string;
  coralColor: string;
  circleStroke: string;
}

export const MercuryMarkSvg: React.FC<MercuryMarkSvgProps> = ({
  strokeColor,
  dropletUpperColor,
  coralColor,
  circleStroke
}) => {
  return (
    <g id="mercury-mark" transform="translate(10, 0)">
      {/* Definitions for droplet clipping and liquid fill */}
      <defs>
        {/* Precise Teardrop Droplet Path */}
        <clipPath id="mercury-droplet-clip">
          <path d="M 250 82 C 250 82 155 235 155 315 C 155 372 198 416 250 416 C 302 416 345 372 345 315 C 345 235 250 82 250 82 Z" />
        </clipPath>
      </defs>

      {/* 1. Corner brackets of the viewfinder reticle */}
      <g stroke={strokeColor} strokeWidth="18" strokeLinecap="square">
        {/* Top-Left Bracket */}
        <path d="M 72 170 L 72 74 L 168 74" fill="none" />
        {/* Top-Right Bracket */}
        <path d="M 332 74 L 428 74 L 428 170" fill="none" />
        {/* Bottom-Left Bracket */}
        <path d="M 72 330 L 72 426 L 168 426" fill="none" />
        {/* Bottom-Right Bracket */}
        <path d="M 332 426 L 428 426 L 428 330" fill="none" />
      </g>

      {/* 2. Crosshair tick marks */}
      <g stroke={strokeColor} strokeWidth="18" strokeLinecap="square">
        {/* Left Tick */}
        <line x1="42" y1="250" x2="135" y2="250" />
        {/* Right Tick */}
        <line x1="365" y1="250" x2="458" y2="250" />
        {/* Top Tick - extends into center to touch droplet tip */}
        <line x1="250" y1="42" x2="250" y2="135" />
        {/* Bottom Tick */}
        <line x1="250" y1="365" x2="250" y2="458" />
      </g>

      {/* 3. Central Lens / Target Circle */}
      <circle
        cx="250"
        cy="250"
        r="146"
        stroke={circleStroke}
        strokeWidth="15"
        fill="none"
      />

      {/* 4. Colorimetric Droplet inside target circle */}
      <g clipPath="url(#mercury-droplet-clip)">
        {/* Upper Droplet (Teal / Charcoal Slate) */}
        <rect
          x="140"
          y="70"
          width="220"
          height="360"
          fill={dropletUpperColor}
        />

        {/* Lower Liquid Wave / Meniscus (Reagent coral fluid) */}
        {/* Liquid surface curves naturally across the droplet body */}
        <path
          d="M 140 292 Q 200 270, 250 286 T 360 278 L 360 430 L 140 430 Z"
          fill={coralColor}
        />
      </g>
    </g>
  );
};
