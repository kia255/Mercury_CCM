import React from 'react';
import { ProductCategory } from '../../types';

interface SkincarePlaceholderProps {
  category: ProductCategory;
  categoryLabel?: string;
  className?: string;
  seed?: string; // used for deterministic pastel background color variation
}

export const SkincarePlaceholder: React.FC<SkincarePlaceholderProps> = ({
  category,
  categoryLabel,
  className = "w-full h-full",
  seed = ""
}) => {
  // Pastel palette variations for visual appeal without stock photos
  const colorVariants = [
    { bg: '#F0FDF9', accent: '#0F4C5C', light: '#CCFBF1' }, // Soft Mint
    { bg: '#FFF7F5', accent: '#E8837A', light: '#FFE4E1' }, // Soft Rose/Coral
    { bg: '#F8FAFC', accent: '#475569', light: '#E2E8F0' }, // Slate Silver
    { bg: '#F0F9FF', accent: '#0369A1', light: '#E0F2FE' }, // Soft Sky
    { bg: '#FEFCE8', accent: '#B45309', light: '#FEF08A' }, // Soft Warm Honey
  ];

  // Pick variation deterministically from seed or category
  const charCode = (seed || category).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variant = colorVariants[charCode % colorVariants.length];

  return (
    <div className={`relative overflow-hidden flex items-center justify-center p-3 select-none ${className}`} style={{ backgroundColor: variant.bg }}>
      
      {/* Soft background shape */}
      <div 
        className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-40 pointer-events-none" 
        style={{ backgroundColor: variant.light }}
      />
      <div 
        className="absolute -top-6 -left-6 w-20 h-20 rounded-full opacity-30 pointer-events-none" 
        style={{ backgroundColor: variant.light }}
      />

      <svg
        viewBox="0 0 160 130"
        className="w-full h-full max-h-36 object-contain drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Render vector based on skincare category */}
        {(category === 'krim_malam' || category === 'krim_siang') && (
          /* CREAM JAR CONTAINER */
          <g transform="translate(42, 22)">
            {/* Shadow under jar */}
            <ellipse cx="38" cy="85" rx="34" ry="7" fill="#000000" fillOpacity="0.06" />
            
            {/* Jar Glass/Ceramic Body */}
            <path
              d="M 6 35 C 6 28, 70 28, 70 35 L 68 76 C 68 82, 8 82, 8 76 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />
            {/* Inner cream level visible through frosted glass */}
            <path
              d="M 12 45 C 12 40, 64 40, 64 45 L 63 72 C 63 76, 13 76, 13 72 Z"
              fill={category === 'krim_malam' ? '#EDE9FE' : '#FEF3C7'}
              fillOpacity="0.7"
            />
            {/* Minimalist label strip on jar */}
            <rect x="16" y="52" width="44" height="16" rx="3" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
            <text x="38" y="63" fill="#0F4C5C" fontSize="5.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.4">
              {category === 'krim_malam' ? 'NIGHT CREAM' : 'DAY CREAM'}
            </text>

            {/* Jar Lid / Cap */}
            <rect x="3" y="18" width="70" height="15" rx="5" fill="#0F4C5C" stroke="#0A3540" strokeWidth="1.2" />
            {/* Metallic lid rim reflection */}
            <line x1="8" y1="23" x2="68" y2="23" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
            <line x1="8" y1="26" x2="68" y2="26" stroke="#FFFFFF" strokeWidth="0.5" strokeOpacity="0.2" strokeLinecap="round" />
          </g>
        )}

        {category === 'serum' && (
          /* SERUM DROPPER BOTTLE */
          <g transform="translate(48, 15)">
            {/* Shadow */}
            <ellipse cx="32" cy="98" rx="26" ry="6" fill="#000000" fillOpacity="0.06" />

            {/* Dropper Rubber Bulb */}
            <path d="M 24 5 C 24 0, 40 0, 40 5 L 42 16 L 22 16 Z" fill="#E8837A" stroke="#D96F65" strokeWidth="1" />
            {/* Dropper Metallic Collar */}
            <rect x="20" y="16" width="24" height="8" rx="2" fill="#0F4C5C" stroke="#0A3540" strokeWidth="1" />
            <line x1="22" y1="20" x2="42" y2="20" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.5" />

            {/* Glass Bottle Body */}
            <path
              d="M 12 30 C 12 24, 52 24, 52 30 L 52 88 C 52 94, 12 94, 12 88 Z"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />
            {/* Serum Liquid inside */}
            <path
              d="M 16 46 L 48 46 L 48 85 C 48 90, 16 90, 16 85 Z"
              fill="#E0F2FE"
              fillOpacity="0.8"
            />
            {/* Internal glass pipette line */}
            <rect x="30" y="24" width="4" height="58" rx="1.5" fill="#FFFFFF" fillOpacity="0.8" stroke="#CBD5E1" strokeWidth="0.6" />
            <circle cx="32" cy="85" r="2.5" fill="#E8837A" />

            {/* Minimalist label */}
            <rect x="18" y="55" width="28" height="20" rx="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.7" />
            <text x="32" y="65" fill="#0F4C5C" fontSize="5" fontWeight="bold" textAnchor="middle">
              SERUM
            </text>
            <text x="32" y="71" fill="#64748B" fontSize="3.5" fontWeight="semibold" textAnchor="middle">
              FACIAL LAB
            </text>
          </g>
        )}

        {category === 'sabun' && (
          /* ORGANIC SOAP BAR */
          <g transform="translate(36, 26)">
            {/* Shadow */}
            <ellipse cx="44" cy="78" rx="38" ry="8" fill="#000000" fillOpacity="0.06" />

            {/* Soap Bar */}
            <rect x="6" y="20" width="76" height="50" rx="12" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />
            {/* Soap 3D bevel top curve */}
            <path
              d="M 10 28 C 10 22, 78 22, 78 28 L 76 60 C 76 66, 12 66, 12 60 Z"
              fill="#FFFBEB"
            />
            {/* Imprinted Stamp on Soap */}
            <rect x="22" y="34" width="44" height="18" rx="4" fill="none" stroke="#D97706" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 1" />
            <text x="44" y="46" fill="#B45309" fontSize="6.5" fontWeight="extrabold" textAnchor="middle" letterSpacing="0.5">
              NATURAL SOAP
            </text>

            {/* Little aesthetic lather bubbles */}
            <circle cx="78" cy="18" r="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" fillOpacity="0.8" />
            <circle cx="86" cy="12" r="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" fillOpacity="0.8" />
            <circle cx="72" cy="14" r="2.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.6" fillOpacity="0.8" />
          </g>
        )}

        {category === 'toner' && (
          /* SLENDER TONER BOTTLE */
          <g transform="translate(52, 14)">
            {/* Shadow */}
            <ellipse cx="28" cy="98" rx="22" ry="5" fill="#000000" fillOpacity="0.06" />

            {/* Cap */}
            <rect x="18" y="5" width="20" height="18" rx="3" fill="#0F4C5C" stroke="#0A3540" strokeWidth="1" />
            <line x1="20" y1="12" x2="36" y2="12" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.4" />

            {/* Slender Bottle */}
            <rect x="12" y="23" width="32" height="72" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Liquid inside */}
            <rect x="15" y="40" width="26" height="52" rx="4" fill="#CCFBF1" fillOpacity="0.6" />

            {/* Label */}
            <rect x="16" y="45" width="24" height="30" rx="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.7" />
            <text x="28" y="58" fill="#0F4C5C" fontSize="5.5" fontWeight="bold" textAnchor="middle">
              TONER
            </text>
            <text x="28" y="65" fill="#64748B" fontSize="3.5" fontWeight="medium" textAnchor="middle">
              ESSENCE
            </text>
          </g>
        )}

        {(category === 'lotion' || category === 'masker' || category === 'lainnya') && (
          /* LOTION PUMP OR COSMETIC TUBE */
          <g transform="translate(48, 14)">
            {/* Shadow */}
            <ellipse cx="32" cy="98" rx="26" ry="6" fill="#000000" fillOpacity="0.06" />

            {/* Pump Head */}
            <path d="M 32 4 L 46 4 C 48 4, 48 9, 44 9 L 32 9 Z" fill="#0F4C5C" />
            <rect x="29" y="4" width="6" height="14" fill="#0F4C5C" />
            <rect x="22" y="16" width="20" height="8" rx="2" fill="#E8837A" />

            {/* Bottle body */}
            <rect x="14" y="24" width="36" height="72" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            
            {/* Label */}
            <rect x="18" y="40" width="28" height="36" rx="3" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.8" />
            <text x="32" y="55" fill="#0F4C5C" fontSize="5" fontWeight="extrabold" textAnchor="middle">
              SKINCARE
            </text>
            <text x="32" y="63" fill="#64748B" fontSize="4" fontWeight="semibold" textAnchor="middle">
              DAILY CARE
            </text>
            <line x1="22" y1="68" x2="42" y2="68" stroke="#E8837A" strokeWidth="1" strokeLinecap="round" />
          </g>
        )}
      </svg>

      {/* Label kecil Ilustrasi Produk di pojok */}
      <span className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-500 border border-slate-200/80 tracking-tight">
        Ilustrasi produk
      </span>
    </div>
  );
};
