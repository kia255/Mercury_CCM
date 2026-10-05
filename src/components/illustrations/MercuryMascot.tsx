import React from 'react';

export type MascotMood = 'happy' | 'alert' | 'curious' | 'wave' | 'celebrate';

interface MercuryMascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
}

/**
 * "Kuri" / Si Tetes MERCURY
 * Maskot tetesan ramah dengan ekspresi wajah manusiawi,
 * menggunakan palet teal #0F4C5C, silver #94A3B8, dan aksen coral #E8837A.
 */
export const MercuryMascot: React.FC<MercuryMascotProps> = ({
  mood = 'happy',
  size = 64,
  className = ""
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Metallic Silver-Teal Drop Gradient */}
          <linearGradient id="dropletGrad" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="40%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Highlight sheen gradient */}
          <linearGradient id="sheenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Shadow underneath */}
        <ellipse cx="50" cy="92" rx="28" ry="6" fill="#0F4C5C" fillOpacity="0.12" />

        {/* Main Droplet Body (Smooth teardrop) */}
        <path
          d="M 50 12 C 50 12, 16 52, 16 68 C 16 86, 31 92, 50 92 C 69 92, 84 86, 84 68 C 84 52, 50 12, 50 12 Z"
          fill="url(#dropletGrad)"
          stroke="#0F4C5C"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Specular curved reflection sheen */}
        <path
          d="M 32 36 C 26 48, 24 60, 26 72"
          stroke="url(#sheenGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="34" cy="30" r="3" fill="#FFFFFF" fillOpacity="0.9" />

        {/* Cheeks (Blushing coral dots) */}
        <circle cx="34" cy="67" r="4.5" fill="#E8837A" fillOpacity="0.5" />
        <circle cx="66" cy="67" r="4.5" fill="#E8837A" fillOpacity="0.5" />

        {/* EYES & MOUTH BASED ON MOOD */}
        {mood === 'happy' && (
          <>
            {/* Friendly curved smiling eyes */}
            <path d="M 35 56 Q 41 50 47 56" stroke="#0F4C5C" strokeWidth="3" strokeLinecap="round" />
            <path d="M 53 56 Q 59 50 65 56" stroke="#0F4C5C" strokeWidth="3" strokeLinecap="round" />
            {/* Cute open smile */}
            <path d="M 43 65 Q 50 74 57 65" stroke="#0F4C5C" strokeWidth="3" strokeLinecap="round" fill="#E8837A" />
          </>
        )}

        {mood === 'wave' && (
          <>
            {/* Big sparkle eyes */}
            <ellipse cx="40" cy="54" rx="4" ry="5" fill="#0F4C5C" />
            <circle cx="38" cy="52" r="1.5" fill="#FFFFFF" />
            <ellipse cx="60" cy="54" rx="4" ry="5" fill="#0F4C5C" />
            <circle cx="58" cy="52" r="1.5" fill="#FFFFFF" />
            {/* Sweet smile */}
            <path d="M 44 65 Q 50 72 56 65" stroke="#0F4C5C" strokeWidth="2.5" strokeLinecap="round" />
            {/* Waving little hand on right */}
            <path d="M 76 60 Q 86 52 88 44 Q 90 52 82 64" fill="#CBD5E1" stroke="#0F4C5C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {mood === 'alert' && (
          <>
            {/* Wide concerned eyes */}
            <circle cx="40" cy="53" r="5" fill="#FFFFFF" stroke="#0F4C5C" strokeWidth="2" />
            <circle cx="40" cy="54" r="2.5" fill="#DC2626" />
            <circle cx="60" cy="53" r="5" fill="#FFFFFF" stroke="#0F4C5C" strokeWidth="2" />
            <circle cx="60" cy="54" r="2.5" fill="#DC2626" />
            {/* O-shaped worried mouth */}
            <ellipse cx="50" cy="69" rx="3.5" ry="4.5" fill="#0F4C5C" />
            {/* Tiny sweat bead */}
            <path d="M 68 36 C 68 36, 73 42, 73 45 C 73 48, 70 48, 68 45 Z" fill="#38BDF8" />
          </>
        )}

        {mood === 'curious' && (
          <>
            {/* One eye big, one eye curious wink */}
            <ellipse cx="40" cy="54" rx="4.5" ry="5" fill="#0F4C5C" />
            <circle cx="38" cy="52" r="1.5" fill="#FFFFFF" />
            <path d="M 56 55 Q 61 50 66 55" stroke="#0F4C5C" strokeWidth="2.5" strokeLinecap="round" />
            {/* Inquisitive little mouth */}
            <path d="M 47 67 Q 52 64 55 67" stroke="#0F4C5C" strokeWidth="2.5" strokeLinecap="round" />
            {/* Little question mark overhead */}
            <text x="70" y="32" fill="#E8837A" fontSize="18" fontWeight="bold">?</text>
          </>
        )}

        {mood === 'celebrate' && (
          <>
            {/* Happy closed eyes */}
            <path d="M 34 56 Q 41 49 48 56" stroke="#0F4C5C" strokeWidth="3" strokeLinecap="round" />
            <path d="M 52 56 Q 59 49 66 56" stroke="#0F4C5C" strokeWidth="3" strokeLinecap="round" />
            {/* Big happy mouth */}
            <path d="M 41 64 Q 50 78 59 64 Z" fill="#E8837A" stroke="#0F4C5C" strokeWidth="2" />
            {/* Stars */}
            <text x="18" y="38" fill="#F59E0B" fontSize="12">✦</text>
            <text x="74" y="38" fill="#F59E0B" fontSize="12">✦</text>
          </>
        )}

        {/* Small Hg chemical symbol badge on tummy */}
        <rect x="42" y="77" width="16" height="10" rx="3" fill="#0F4C5C" />
        <text x="50" y="84.5" fill="#FFFFFF" fontSize="6.5" fontWeight="900" textAnchor="middle">
          Hg
        </text>
      </svg>
    </div>
  );
};
