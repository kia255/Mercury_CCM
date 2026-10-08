import React from 'react';

interface KitIllustrationProps {
  packageId: string;
  className?: string;
}

export const KitIllustration: React.FC<KitIllustrationProps> = ({ packageId, className = "w-full h-full" }) => {
  if (packageId === 'hg-test-kit' || packageId === 'pkg-5') {
    return <HgTestKitIllustration className={className} />;
  }
  if (packageId === 'pkg-1') {
    return <StarterPackIllustration className={className} />;
  }
  return <HgTestKitIllustration className={className} />;
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

/**
 * Hg Test Kit Illustration (Official Single Product)
 * Displays:
 * - Product Packaging Box / Pouch with "Hg Test Kit - Isi 5 strip", Batch MRC-2026-A05, and QR code
 * - 5 Mercury Test Strips (arranged in an elegant fan array)
 * - 2 Color Reference Cards (with calibration target circles and color scales)
 * - 5 Disposable Sampling Applicators / Spatulas
 * - Illustrated user guide folded card
 * - Corner badge: "Ilustrasi produk"
 */
export const HgTestKitIllustration: React.FC<{ className?: string; large?: boolean }> = ({ 
  className = "w-full h-full",
  large = false 
}) => {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F4FAF8] via-[#FFFFFF] to-[#FFF6F4] flex items-center justify-center p-4 sm:p-6 select-none border border-teal-100/80 shadow-inner ${className}`}>
      {/* Ambient background glow and soft shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-100/30 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#E8837A]/15 blur-2xl pointer-events-none" />
      
      {/* Subtle grid background texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="kit-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0F4C5C" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kit-grid)" />
      </svg>

      <svg
        viewBox="0 0 540 380"
        className={`w-full h-full ${large ? 'max-h-[360px] md:max-h-[420px]' : 'max-h-56'} object-contain drop-shadow-md`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F4C5C" />
            <stop offset="100%" stopColor="#1C353D" />
          </linearGradient>

          <linearGradient id="coralAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8837A" />
            <stop offset="100%" stopColor="#D96F65" />
          </linearGradient>

          <linearGradient id="reagentGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="reagentGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>

          <filter id="shadowFilter" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0F4C5C" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. PRODUCT PACKAGING BOX (Rear Left) */}
        <g transform="translate(40, 50)" filter="url(#shadowFilter)">
          <rect x="0" y="0" width="165" height="235" rx="16" fill="url(#boxGrad)" stroke="#166479" strokeWidth="2" />
          <rect x="0" y="0" width="165" height="12" rx="6" fill="url(#coralAccentGrad)" />
          
          {/* Brand & Logo on Box */}
          <g transform="translate(18, 26)">
            <circle cx="14" cy="14" r="10" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 1.5" fill="none" opacity="0.9" />
            <path d="M 14 6 C 14 6 9 13 9 16 C 9 18.5 11.2 20.5 14 20.5 C 16.8 20.5 19 18.5 19 16 C 19 13 14 6 14 6 Z" fill="#E8837A" />
            
            <text x="32" y="14" fill="#FFFFFF" fontSize="13" fontWeight="900" letterSpacing="-0.5" fontFamily="Plus Jakarta Sans, sans-serif">
              MERCURY
            </text>
            <text x="32" y="24" fill="#99F6E4" fontSize="8" fontWeight="bold" letterSpacing="0.5">
              LAB-GRADE SCREENING
            </text>
          </g>

          {/* Product Title Badge on Box */}
          <rect x="14" y="68" width="137" height="64" rx="10" fill="#FFFFFF" />
          <text x="24" y="88" fill="#0F4C5C" fontSize="13" fontWeight="900">
            Hg Test Kit
          </text>
          <rect x="24" y="94" width="62" height="15" rx="4" fill="#F0FDF9" stroke="#99F6E4" strokeWidth="0.8" />
          <text x="55" y="105" fill="#0F4C5C" fontSize="8" fontWeight="bold" textAnchor="middle">
            Isi 5 Strip
          </text>
          <text x="24" y="122" fill="#64748B" fontSize="7" fontWeight="medium">
            Skrining Cepat Kosmetik & Skincare
          </text>

          {/* QR Code and Batch Code Box (Requirement: Kode batch dan QR) */}
          <g transform="translate(14, 142)">
            <rect x="0" y="0" width="137" height="74" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
            
            {/* Simulated QR Code */}
            <g transform="translate(10, 10)">
              <rect x="0" y="0" width="42" height="42" fill="#FFFFFF" stroke="#0F4C5C" strokeWidth="1.2" rx="4" />
              <rect x="4" y="4" width="12" height="12" fill="#0F4C5C" rx="1" />
              <rect x="6" y="6" width="8" height="8" fill="#FFFFFF" />
              <rect x="8" y="8" width="4" height="4" fill="#0F4C5C" />

              <rect x="26" y="4" width="12" height="12" fill="#0F4C5C" rx="1" />
              <rect x="28" y="6" width="8" height="8" fill="#FFFFFF" />
              <rect x="30" y="8" width="4" height="4" fill="#0F4C5C" />

              <rect x="4" y="26" width="12" height="12" fill="#0F4C5C" rx="1" />
              <rect x="6" y="28" width="8" height="8" fill="#FFFFFF" />
              <rect x="8" y="30" width="4" height="4" fill="#0F4C5C" />

              <rect x="18" y="18" width="6" height="6" fill="#0F4C5C" />
              <rect x="26" y="22" width="4" height="4" fill="#0F4C5C" />
              <rect x="20" y="28" width="5" height="5" fill="#0F4C5C" />
              <rect x="32" y="30" width="6" height="6" fill="#0F4C5C" />
              <rect x="18" y="6" width="4" height="8" fill="#0F4C5C" />
            </g>

            {/* Batch Info Text */}
            <g transform="translate(60, 14)">
              <text x="0" y="10" fill="#64748B" fontSize="6.5" fontWeight="bold">
                KODE BATCH RESMI
              </text>
              <text x="0" y="23" fill="#0F4C5C" fontSize="9" fontWeight="900" fontFamily="monospace">
                MRC-2026-A05
              </text>
              <text x="0" y="34" fill="#64748B" fontSize="6.5">
                Exp: 2028-12
              </text>
              <rect x="0" y="40" width="68" height="14" rx="4" fill="#0F4C5C" />
              <text x="34" y="50" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">
                SCAN & VERIFY QR
              </text>
            </g>
          </g>
        </g>

        {/* 2. DUA KARTU REFERENSI WARNA (Requirement: 2 kartu referensi warna) */}
        {/* Kartu Referensi 1 (Belakang) */}
        <g transform="translate(195, 75) rotate(-6)" filter="url(#shadowFilter)">
          <rect x="0" y="0" width="115" height="155" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="0" y="0" width="115" height="26" rx="10" fill="#0F4C5C" />
          <rect x="0" y="16" width="115" height="10" fill="#0F4C5C" />
          <text x="57" y="16" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
            COLOR REFERENCE CARD 1
          </text>
          
          <circle cx="57" cy="65" r="22" stroke="#0F4C5C" strokeWidth="1.5" strokeDasharray="3 2" fill="#F8FAFC" />
          <line x1="57" y1="38" x2="57" y2="92" stroke="#0F4C5C" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="30" y1="65" x2="84" y2="65" stroke="#0F4C5C" strokeWidth="1" strokeOpacity="0.4" />
          
          <g transform="translate(14, 105)">
            <rect x="0" y="0" width="18" height="16" rx="3" fill="#FFF9DB" stroke="#E2E8F0" strokeWidth="0.8" />
            <text x="9" y="24" fill="#64748B" fontSize="5.5" textAnchor="middle">0 ppm</text>

            <rect x="22" y="0" width="18" height="16" rx="3" fill="#FED7AA" stroke="#E2E8F0" strokeWidth="0.8" />
            <text x="31" y="24" fill="#64748B" fontSize="5.5" textAnchor="middle">&lt;1 ppm</text>

            <rect x="44" y="0" width="18" height="16" rx="3" fill="#FB923C" stroke="#E2E8F0" strokeWidth="0.8" />
            <text x="53" y="24" fill="#64748B" fontSize="5.5" textAnchor="middle">5 ppm</text>

            <rect x="66" y="0" width="18" height="16" rx="3" fill="#DC2626" stroke="#E2E8F0" strokeWidth="0.8" />
            <text x="75" y="24" fill="#64748B" fontSize="5.5" textAnchor="middle">&gt;20 ppm</text>
          </g>
          
          <text x="57" y="145" fill="#94A3B8" fontSize="6" fontWeight="bold" textAnchor="middle">
            STANDARD LAB CALIBRATION
          </text>
        </g>

        {/* Kartu Referensi 2 (Depan) */}
        <g transform="translate(225, 90) rotate(5)" filter="url(#shadowFilter)">
          <rect x="0" y="0" width="118" height="158" rx="10" fill="#FFFFFF" stroke="#0F4C5C" strokeWidth="1.8" />
          <rect x="0" y="0" width="118" height="26" rx="10" fill="#0F4C5C" />
          <rect x="0" y="16" width="118" height="10" fill="#0F4C5C" />
          <text x="59" y="16" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
            COLOR REFERENCE CARD 2
          </text>
          
          <circle cx="59" cy="65" r="22" stroke="#0F4C5C" strokeWidth="1.5" strokeDasharray="3 2" fill="#FFFFFF" />
          <circle cx="59" cy="65" r="6" fill="#E8837A" opacity="0.3" />
          <line x1="59" y1="38" x2="59" y2="92" stroke="#0F4C5C" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="32" y1="65" x2="86" y2="65" stroke="#0F4C5C" strokeWidth="1" strokeOpacity="0.5" />
          
          <g transform="translate(15, 105)">
            <rect x="0" y="0" width="88" height="12" rx="3" fill="url(#boxGrad)" />
            <text x="44" y="22" fill="#0F4C5C" fontSize="6" fontWeight="extrabold" textAnchor="middle">
              KARTU KALIBRASI KAMERA HP
            </text>
            <text x="44" y="34" fill="#64748B" fontSize="5.5" textAnchor="middle">
              Anti-Glare Matte Finish
            </text>
          </g>
        </g>

        {/* 3. PANDUAN BERGAMBAR & SKALA WARNA (Requirement: Panduan bergambar dan skala warna) */}
        <g transform="translate(160, 220) rotate(-4)" filter="url(#shadowFilter)">
          <rect x="0" y="0" width="130" height="90" rx="8" fill="#FFFDF8" stroke="#FDE68A" strokeWidth="1.5" />
          <rect x="0" y="0" width="130" height="20" rx="8" fill="#FBBF24" />
          <rect x="0" y="12" width="130" height="8" fill="#FBBF24" />
          <text x="65" y="14" fill="#78350F" fontSize="8" fontWeight="900" textAnchor="middle">
            📖 PANDUAN 4 LANGKAH & SKALA WARNA
          </text>
          
          <g transform="translate(10, 26)">
            <circle cx="12" cy="12" r="9" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
            <text x="12" y="15" fill="#78350F" fontSize="8" fontWeight="bold" textAnchor="middle">1</text>
            <text x="12" y="30" fill="#92400E" fontSize="5" textAnchor="middle">Sampel</text>

            <circle cx="40" cy="12" r="9" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
            <text x="40" y="15" fill="#78350F" fontSize="8" fontWeight="bold" textAnchor="middle">2</text>
            <text x="40" y="30" fill="#92400E" fontSize="5" textAnchor="middle">Tetes</text>

            <circle cx="68" cy="12" r="9" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
            <text x="68" y="15" fill="#78350F" fontSize="8" fontWeight="bold" textAnchor="middle">3</text>
            <text x="68" y="30" fill="#92400E" fontSize="5" textAnchor="middle">Tunggu</text>

            <circle cx="96" cy="12" r="9" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
            <text x="96" y="15" fill="#78350F" fontSize="8" fontWeight="bold" textAnchor="middle">4</text>
            <text x="96" y="30" fill="#92400E" fontSize="5" textAnchor="middle">Foto</text>
          </g>

          <g transform="translate(10, 64)">
            <rect x="0" y="0" width="110" height="8" rx="2" fill="url(#coralAccentGrad)" />
            <text x="55" y="16" fill="#78350F" fontSize="5.5" fontWeight="bold" textAnchor="middle">
              Skala Warna Reagen Hg (0 - 50 ppm)
            </text>
          </g>
        </g>

        {/* 4. LIMA STRIP KERTAS UJI MERKURI (Requirement: 5 strip kertas uji merkuri) */}
        {/* Strip 1 */}
        <g transform="translate(300, 70) rotate(-16)" filter="url(#shadowFilter)">
          <rect x="0" y="0" width="34" height="175" rx="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x="4" y="5" width="26" height="14" rx="3" fill="#0F4C5C" />
          <text x="17" y="15" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle">Hg</text>
          <line x1="6" y1="30" x2="16" y2="30" stroke="#94A3B8" strokeWidth="1" />
          <line x1="6" y1="38" x2="14" y2="38" stroke="#CBD5E1" strokeWidth="1" />
          <rect x="4" y="55" width="26" height="38" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="17" cy="74" r="9" fill="url(#reagentGrad1)" stroke="#F59E0B" strokeWidth="1" />
          <text x="17" y="125" fill="#94A3B8" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">1/5</text>
        </g>

        {/* Strip 2 */}
        <g transform="translate(325, 60) rotate(-8)" filter="url(#shadowFilter)">
          <rect x="0" y="0" width="34" height="178" rx="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x="4" y="5" width="26" height="14" rx="3" fill="#0F4C5C" />
          <text x="17" y="15" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle">Hg</text>
          <line x1="6" y1="30" x2="16" y2="30" stroke="#94A3B8" strokeWidth="1" />
          <line x1="6" y1="38" x2="14" y2="38" stroke="#CBD5E1" strokeWidth="1" />
          <rect x="4" y="55" width="26" height="38" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="17" cy="74" r="9" fill="url(#reagentGrad2)" stroke="#F59E0B" strokeWidth="1" />
          <text x="17" y="125" fill="#94A3B8" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">2/5</text>
        </g>

        {/* Strip 3 (Center) */}
        <g transform="translate(352, 52) rotate(0)" filter="url(#shadowFilter)">
          <rect x="0" y="0" width="36" height="184" rx="6" fill="#FFFFFF" stroke="#0F4C5C" strokeWidth="1.8" />
          <rect x="4" y="5" width="28" height="15" rx="3" fill="#0F4C5C" />
          <text x="18" y="16" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">Hg</text>
          <line x1="6" y1="32" x2="18" y2="32" stroke="#94A3B8" strokeWidth="1" />
          <line x1="6" y1="40" x2="14" y2="40" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="6" y1="48" x2="18" y2="48" stroke="#94A3B8" strokeWidth="1" />
          <rect x="4" y="60" width="28" height="42" rx="4" fill="#F0FDF9" stroke="#99F6E4" strokeWidth="1.2" />
          <circle cx="18" cy="81" r="10" fill="url(#reagentGrad1)" stroke="#D97706" strokeWidth="1.2" />
          <circle cx="18" cy="81" r="4" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 1" />
          <text x="18" y="122" fill="#0F4C5C" fontSize="6.5" fontWeight="extrabold" textAnchor="middle">ZONE</text>
          <text x="18" y="140" fill="#64748B" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">3/5</text>
          <text x="18" y="160" fill="#0F4C5C" fontSize="5" fontWeight="bold" textAnchor="middle">MERCURY</text>
        </g>

        {/* Strip 4 */}
        <g transform="translate(382, 58) rotate(8)" filter="url(#shadowFilter)">
          <rect x="0" y="0" width="34" height="178" rx="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x="4" y="5" width="26" height="14" rx="3" fill="#0F4C5C" />
          <text x="17" y="15" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle">Hg</text>
          <line x1="6" y1="30" x2="16" y2="30" stroke="#94A3B8" strokeWidth="1" />
          <line x1="6" y1="38" x2="14" y2="38" stroke="#CBD5E1" strokeWidth="1" />
          <rect x="4" y="55" width="26" height="38" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="17" cy="74" r="9" fill="url(#reagentGrad2)" stroke="#F59E0B" strokeWidth="1" />
          <text x="17" y="125" fill="#94A3B8" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">4/5</text>
        </g>

        {/* Strip 5 */}
        <g transform="translate(410, 68) rotate(16)" filter="url(#shadowFilter)">
          <rect x="0" y="0" width="34" height="175" rx="6" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
          <rect x="4" y="5" width="26" height="14" rx="3" fill="#0F4C5C" />
          <text x="17" y="15" fill="#FFFFFF" fontSize="8" fontWeight="900" textAnchor="middle">Hg</text>
          <line x1="6" y1="30" x2="16" y2="30" stroke="#94A3B8" strokeWidth="1" />
          <line x1="6" y1="38" x2="14" y2="38" stroke="#CBD5E1" strokeWidth="1" />
          <rect x="4" y="55" width="26" height="38" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="17" cy="74" r="9" fill="url(#reagentGrad1)" stroke="#F59E0B" strokeWidth="1" />
          <text x="17" y="125" fill="#94A3B8" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="monospace">5/5</text>
        </g>

        {/* 5. LIMA ALAT AMBIL SAMPEL SEKALI PAKAI (Requirement: 5 alat ambil sampel sekali pakai) */}
        <g transform="translate(300, 260)">
          <g transform="translate(0, 0) rotate(-20)">
            <path d="M 4 0 L 8 0 L 7 75 L 5 75 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
            <path d="M 2 72 C 0 85, 12 85, 10 72 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
          </g>
          <g transform="translate(25, -6) rotate(-10)">
            <path d="M 4 0 L 8 0 L 7 78 L 5 78 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
            <path d="M 2 75 C 0 88, 12 88, 10 75 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
          </g>
          <g transform="translate(50, -10) rotate(0)">
            <path d="M 4 0 L 8 0 L 7 80 L 5 80 Z" fill="#F1F5F9" stroke="#0F4C5C" strokeWidth="1" />
            <path d="M 2 77 C 0 90, 12 90, 10 77 Z" fill="#E2E8F0" stroke="#0F4C5C" strokeWidth="1" />
          </g>
          <g transform="translate(75, -6) rotate(10)">
            <path d="M 4 0 L 8 0 L 7 78 L 5 78 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
            <path d="M 2 75 C 0 88, 12 88, 10 75 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
          </g>
          <g transform="translate(100, 0) rotate(20)">
            <path d="M 4 0 L 8 0 L 7 75 L 5 75 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
            <path d="M 2 72 C 0 85, 12 85, 10 72 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
          </g>
          <text x="56" y="96" fill="#64748B" fontSize="6.5" fontWeight="bold" textAnchor="middle">
            5x Alat Ambil Sampel Sekali Pakai
          </text>
        </g>
      </svg>

      {/* Label kecil "Ilustrasi produk" di pojok kanan bawah */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] sm:text-xs font-bold text-slate-500 border border-slate-200/90 shadow-xs tracking-tight flex items-center gap-1.5 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
        <span>Ilustrasi produk</span>
      </div>
    </div>
  );
};
