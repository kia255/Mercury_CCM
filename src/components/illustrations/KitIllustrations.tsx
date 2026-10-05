import React from 'react';

interface KitIllustrationProps {
  packageId: string;
  className?: string;
}

export const KitIllustration: React.FC<KitIllustrationProps> = ({ packageId, className = "w-full h-full" }) => {
  if (packageId === 'pkg-1') {
    return <StarterPackIllustration className={className} />;
  }
  if (packageId === 'pkg-5') {
    return <RoutinePackIllustration className={className} />;
  }
  return <CommunityPackIllustration className={className} />;
};

/**
 * Starter Pack Illustration:
 * 1 strip kertas uji + 1 kartu referensi putih + 1 spatula kecil
 * Latar: Mint pucat / teal tint lembut
 */
export const StarterPackIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#F0FDF9] flex items-center justify-center p-3 select-none ${className}`}>
      {/* Background soft geometric rings */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-teal-100/40 pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-emerald-100/30 pointer-events-none" />

      <svg
        viewBox="0 0 320 220"
        className="w-full h-full max-h-48 object-contain drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 1. KARTU REFERENSI PUTIH (Di belakang) */}
        <g transform="translate(45, 30) rotate(-6)">
          {/* Card body */}
          <rect x="0" y="0" width="105" height="135" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Top banner */}
          <rect x="0" y="0" width="105" height="24" rx="8" fill="#0F4C5C" />
          <rect x="0" y="16" width="105" height="8" fill="#0F4C5C" />
          <text x="52" y="15" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
            MERCURY REF
          </text>
          {/* Target circle area */}
          <rect x="15" y="38" width="75" height="55" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeDasharray="3 2" />
          <circle cx="52" cy="65" r="16" stroke="#0F4C5C" strokeWidth="1.5" strokeDasharray="2 2" fill="#FFFFFF" />
          <line x1="52" y1="45" x2="52" y2="85" stroke="#0F4C5C" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="32" y1="65" x2="72" y2="65" stroke="#0F4C5C" strokeWidth="1" strokeOpacity="0.5" />
          <text x="52" y="112" fill="#64748B" fontSize="7" fontWeight="bold" textAnchor="middle">
            WHITE CALIBRATION
          </text>
        </g>

        {/* 2. SPATULA KECIL PENGAMBIL SAMPEL */}
        <g transform="translate(195, 20) rotate(24)">
          {/* Handle */}
          <path
            d="M 6 0 L 14 0 L 12 140 L 8 140 Z"
            fill="#CBD5E1"
            stroke="#94A3B8"
            strokeWidth="1"
          />
          {/* Spoon head / flat tip */}
          <path
            d="M 2 135 C 0 155, 20 155, 18 135 Z"
            fill="#E2E8F0"
            stroke="#94A3B8"
            strokeWidth="1"
          />
          {/* Light highlight on spatula */}
          <line x1="10" y1="10" x2="10" y2="135" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* 3. STRIP KERTAS UJI (Di depan) */}
        <g transform="translate(135, 25) rotate(4)">
          {/* Plastic test strip body */}
          <rect x="0" y="0" width="38" height="155" rx="5" fill="#FFFFFF" stroke="#0F4C5C" strokeWidth="1.5" />
          {/* Header strip indicator */}
          <rect x="4" y="5" width="30" height="12" rx="3" fill="#0F4C5C" />
          <text x="19" y="14" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle">
            Hg
          </text>

          {/* Scale marks */}
          <line x1="6" y1="28" x2="14" y2="28" stroke="#94A3B8" strokeWidth="1" />
          <line x1="6" y1="34" x2="11" y2="34" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="6" y1="40" x2="14" y2="40" stroke="#94A3B8" strokeWidth="1" />

          {/* Test Reaction Spot (Kuning ke salmon muda dengan frame) */}
          <rect x="5" y="60" width="28" height="34" rx="4" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
          <defs>
            <linearGradient id="starterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9ECC4" />
              <stop offset="100%" stopColor="#E8A77A" />
            </linearGradient>
          </defs>
          <circle cx="19" cy="77" r="10" fill="url(#starterGrad)" stroke="#D49366" strokeWidth="1" />
          <circle cx="19" cy="77" r="4" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 1" />

          {/* Lot batch label on strip */}
          <text x="19" y="115" fill="#64748B" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            LOT A01
          </text>
          <text x="19" y="135" fill="#0F4C5C" fontSize="5" fontWeight="bold" textAnchor="middle">
            MERCURY
          </text>
        </g>
      </svg>

      {/* Label kecil Ilustrasi Produk di pojok */}
      <span className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-xs text-[10px] font-bold text-slate-500 border border-slate-200/80 tracking-tight">
        Ilustrasi produk
      </span>
    </div>
  );
};

/**
 * Routine Pack Illustration:
 * 5 strip kertas uji tersusun rapi (kipas) + 2 kartu referensi + pipet kecil
 * Latar: Soft coral tint / warm off-white
 */
export const RoutinePackIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#FFF7F5] flex items-center justify-center p-3 select-none ${className}`}>
      {/* Background accents */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-rose-100/40 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-amber-100/30 pointer-events-none" />

      <svg
        viewBox="0 0 320 220"
        className="w-full h-full max-h-48 object-contain drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 2 KARTU REFERENSI (Tumpuk di belakang) */}
        <g transform="translate(30, 42) rotate(-14)">
          <rect x="0" y="0" width="85" height="115" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
        </g>
        <g transform="translate(42, 32) rotate(-4)">
          <rect x="0" y="0" width="88" height="120" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="0" y="0" width="88" height="20" rx="7" fill="#0F4C5C" />
          <rect x="0" y="14" width="88" height="6" fill="#0F4C5C" />
          <text x="44" y="13" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
            REF CARD 2x
          </text>
          <circle cx="44" cy="62" r="14" stroke="#0F4C5C" strokeWidth="1.2" strokeDasharray="2 2" fill="#F8FAFC" />
          <line x1="44" y1="44" x2="44" y2="80" stroke="#0F4C5C" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="26" y1="62" x2="62" y2="62" stroke="#0F4C5C" strokeWidth="1" strokeOpacity="0.4" />
        </g>

        {/* PIPET TRANSFER KECIL (Di kanan) */}
        <g transform="translate(230, 25) rotate(18)">
          {/* Bulb atas pipet (rubber bulb) */}
          <path d="M 6 0 C 0 8, 0 24, 6 28 C 14 28, 14 8, 8 0 Z" fill="#E8837A" stroke="#D96F65" strokeWidth="1" />
          {/* Batang tabung pipet bening */}
          <rect x="5" y="28" width="4" height="95" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          {/* Ujung pipet runcing */}
          <polygon points="5,123 9,123 7,142" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
          {/* Graduasi ukur */}
          <line x1="5" y1="45" x2="7" y2="45" stroke="#64748B" strokeWidth="0.8" />
          <line x1="5" y1="60" x2="8" y2="60" stroke="#64748B" strokeWidth="0.8" />
          <line x1="5" y1="75" x2="7" y2="75" stroke="#64748B" strokeWidth="0.8" />
          <line x1="5" y1="90" x2="8" y2="90" stroke="#64748B" strokeWidth="0.8" />
        </g>

        {/* 5 STRIP KERTAS UJI BERBENTUK KIPAS (FAN LAYOUT) */}
        {/* Strip 1 */}
        <g transform="translate(100, 38) rotate(-18)">
          <rect x="0" y="0" width="30" height="135" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x="3" y="4" width="24" height="10" rx="2" fill="#0F4C5C" />
          <circle cx="15" cy="55" r="7" fill="#F8E5B8" stroke="#D8C496" strokeWidth="1" />
        </g>
        {/* Strip 2 */}
        <g transform="translate(118, 30) rotate(-9)">
          <rect x="0" y="0" width="30" height="135" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x="3" y="4" width="24" height="10" rx="2" fill="#0F4C5C" />
          <circle cx="15" cy="55" r="7" fill="#F4DCAB" stroke="#D8C496" strokeWidth="1" />
        </g>
        {/* Strip 3 (Center) */}
        <g transform="translate(138, 25) rotate(0)">
          <rect x="0" y="0" width="32" height="142" rx="4" fill="#FFFFFF" stroke="#0F4C5C" strokeWidth="1.5" />
          <rect x="4" y="4" width="24" height="11" rx="2" fill="#0F4C5C" />
          <text x="16" y="12" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
            Hg
          </text>
          <circle cx="16" cy="60" r="8" fill="#F6E7C0" stroke="#D9C69A" strokeWidth="1" />
          <text x="16" y="95" fill="#64748B" fontSize="6" fontWeight="bold" textAnchor="middle">
            5x PACK
          </text>
        </g>
        {/* Strip 4 */}
        <g transform="translate(160, 30) rotate(9)">
          <rect x="0" y="0" width="30" height="135" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x="3" y="4" width="24" height="10" rx="2" fill="#0F4C5C" />
          <circle cx="15" cy="55" r="7" fill="#E8B58A" stroke="#C99468" strokeWidth="1" />
        </g>
        {/* Strip 5 */}
        <g transform="translate(182, 38) rotate(18)">
          <rect x="0" y="0" width="30" height="135" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x="3" y="4" width="24" height="10" rx="2" fill="#0F4C5C" />
          <circle cx="15" cy="55" r="7" fill="#F4DCAB" stroke="#D8C496" strokeWidth="1" />
        </g>

        {/* Small ribbon on pack */}
        <g transform="translate(125, 150)">
          <rect x="0" y="0" width="60" height="18" rx="9" fill="#E8837A" />
          <text x="30" y="12" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
            ISI 5 STRIP
          </text>
        </g>
      </svg>

      {/* Label kecil Ilustrasi Produk di pojok */}
      <span className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-xs text-[10px] font-bold text-slate-500 border border-slate-200/80 tracking-tight">
        Ilustrasi produk
      </span>
    </div>
  );
};

/**
 * Community & Education Pack Illustration:
 * 10 strip kertas uji dalam tabung / box wadah + beberapa pipet dan kartu referensi
 * Latar: Soft Silver-Blue / Neutral Off-White
 */
export const CommunityPackIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#F1F5F9] flex items-center justify-center p-3 select-none ${className}`}>
      {/* Background accents */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-slate-200/60 pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-teal-100/30 pointer-events-none" />

      <svg
        viewBox="0 0 320 220"
        className="w-full h-full max-h-48 object-contain drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* KARTU REFERENSI BERLAPIS DI BELAKANG */}
        <g transform="translate(25, 30) rotate(-8)">
          <rect x="0" y="0" width="85" height="120" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="0" y="0" width="85" height="18" rx="7" fill="#0F4C5C" />
          <text x="42" y="12" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
            LAB STANDARD
          </text>
          <circle cx="42" cy="60" r="14" stroke="#0F4C5C" strokeWidth="1.2" strokeDasharray="2 2" fill="#F8FAFC" />
        </g>
        <g transform="translate(45, 25) rotate(4)">
          <rect x="0" y="0" width="85" height="120" rx="7" fill="#FFFFFF" stroke="#0F4C5C" strokeWidth="1.5" />
          <rect x="0" y="0" width="85" height="18" rx="7" fill="#0F4C5C" />
          <text x="42" y="12" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
            UV RESISTANT
          </text>
          <circle cx="42" cy="60" r="14" stroke="#0F4C5C" strokeWidth="1.2" strokeDasharray="2 2" fill="#FFFFFF" />
        </g>

        {/* 2 PIPET MINI DI KANAN */}
        <g transform="translate(240, 20) rotate(16)">
          <path d="M 6 0 C 0 8, 0 24, 6 28 C 14 28, 14 8, 8 0 Z" fill="#0F4C5C" stroke="#0A3540" strokeWidth="1" />
          <rect x="5" y="28" width="4" height="90" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          <polygon points="5,118 9,118 7,135" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
        </g>
        <g transform="translate(260, 30) rotate(24)">
          <path d="M 6 0 C 0 8, 0 24, 6 28 C 14 28, 14 8, 8 0 Z" fill="#E8837A" stroke="#D96F65" strokeWidth="1" />
          <rect x="5" y="28" width="4" height="85" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          <polygon points="5,113 9,113 7,130" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
        </g>

        {/* WADAH SILINDER / KOTAK TABUNG KIT (BERISI 10 STRIP) */}
        <g transform="translate(130, 35)">
          {/* Ujung strip yang menyembul dari tabung */}
          <rect x="10" y="-18" width="18" height="40" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
          <circle cx="19" cy="-5" r="4" fill="#F8E5B8" />

          <rect x="25" y="-22" width="18" height="40" rx="3" fill="#FFFFFF" stroke="#0F4C5C" strokeWidth="1.2" />
          <rect x="27" y="-20" width="14" height="7" rx="1.5" fill="#0F4C5C" />
          <circle cx="34" cy="-3" r="4" fill="#EAA278" />

          <rect x="42" y="-16" width="18" height="40" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
          <circle cx="51" cy="-4" r="4" fill="#F8E5B8" />

          {/* Badan tabung / box canister */}
          <rect x="0" y="15" width="76" height="135" rx="12" fill="#0F4C5C" stroke="#0A3540" strokeWidth="1.5" />
          {/* Label canister */}
          <rect x="6" y="35" width="64" height="85" rx="6" fill="#FFFFFF" />
          <text x="38" y="52" fill="#0F4C5C" fontSize="9" fontWeight="900" textAnchor="middle">
            MERCURY
          </text>
          <text x="38" y="65" fill="#1E293B" fontSize="7" fontWeight="bold" textAnchor="middle">
            COMMUNITY KIT
          </text>
          <line x1="16" y1="72" x2="60" y2="72" stroke="#E2E8F0" strokeWidth="1" />
          
          <rect x="14" y="80" width="48" height="18" rx="4" fill="#F0FDF9" stroke="#99F6E4" strokeWidth="0.8" />
          <text x="38" y="92" fill="#0F4C5C" fontSize="8" fontWeight="extrabold" textAnchor="middle">
            10x Hg STRIP
          </text>
          <text x="38" y="112" fill="#64748B" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
            BATCH: X10-LAB
          </text>
        </g>
      </svg>

      {/* Label kecil Ilustrasi Produk di pojok */}
      <span className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-xs text-[10px] font-bold text-slate-500 border border-slate-200/80 tracking-tight">
        Ilustrasi produk
      </span>
    </div>
  );
};
