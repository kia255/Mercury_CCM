import { ScreeningStatus, TrustLevel } from '../types';

// ============================================================================
// NILAI KALIBRASI CONTOH, ganti dengan hasil validasi laboratorium
// ----------------------------------------------------------------------------
// Prinsip Uji Kertas Merkuri:
// Reagen kromogenik membentuk senyawa kompleks dengan kation raksa / Hg(II).
// - Sampel tanpa merkuri: tetap rona kuning pucat/krem asli.
// - Sampel terindikasi merkuri: bergeser ke arah merah salmon / jingga kemerahan.
// ============================================================================
export const COLORIMETRY_CALIBRATION = {
  VERSION: "1.0.4-PROTOTYPE",
  
  // Ambang batas deviasi warna ternormalisasi
  THRESHOLD_NEGATIVE_MAX: 18.0,
  THRESHOLD_FURTHER_TEST_MAX: 45.0,
  THRESHOLD_INDICATED_MIN: 45.1,

  SPECTRAL_WEIGHTS: {
    R: 0.35,
    G: 0.45,
    B: 0.20
  },

  BASELINE_BLANK_STRIP: {
    r: 242,
    g: 228,
    b: 185
  },

  SEMI_QUANTITATIVE_SCALE: [
    {
      ppmLabel: "< 1 ppm",
      title: "Batas Aman BPOM",
      colorHex: "#F3E8C4",
      status: "negatif" as ScreeningStatus,
      description: "Tidak terdeteksi perubahan warna pada kertas uji."
    },
    {
      ppmLabel: "1 – 10 ppm",
      title: "Reaksi Samar",
      colorHex: "#EAB388",
      status: "perlu_uji_lanjut" as ScreeningStatus,
      description: "Pergeseran rona ringan, perlu pengujian ulang."
    },
    {
      ppmLabel: "10 – 50 ppm",
      title: "Terindikasi Positif",
      colorHex: "#D9776A",
      status: "terindikasi" as ScreeningStatus,
      description: "Perubahan warna kemerahan terdeteksi jelas."
    },
    {
      ppmLabel: "> 50 ppm",
      title: "Terindikasi Kuat",
      colorHex: "#A93226",
      status: "terindikasi" as ScreeningStatus,
      description: "Warna merah tua / salmon pekat, kadar raksa tinggi."
    }
  ]
};

// ============================================================================
// STATUS CONFIGURATION
// Setiap status WAJIB ikon + label teks + kontras tinggi
// ============================================================================
export const STATUS_CONFIG: Record<ScreeningStatus, {
  label: string;
  shortLabel: string;
  chipLabel: string;
  iconSymbol: string;
  cardBadgeClass: string;
  badgeClass: string;
  borderClass: string;
  textClass: string;
  dotClass: string;
  description: string;
}> = {
  negatif: {
    label: "Aman (Tidak Terdeteksi)",
    shortLabel: "Aman",
    chipLabel: "Aman",
    iconSymbol: "✔",
    cardBadgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200/90",
    badgeClass: "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
    borderClass: "border-emerald-200",
    textClass: "text-emerald-700",
    dotClass: "bg-emerald-500",
    description: "Kandungan merkuri tidak terdeteksi pada kertas uji."
  },
  terindikasi: {
    label: "Terindikasi Merkuri",
    shortLabel: "Terindikasi",
    chipLabel: "Terindikasi",
    iconSymbol: "⚠",
    cardBadgeClass: "bg-rose-50 text-rose-700 border border-rose-200/90",
    badgeClass: "bg-rose-50/90 text-rose-800 border border-rose-200",
    borderClass: "border-rose-200",
    textClass: "text-rose-700",
    dotClass: "bg-rose-600",
    description: "Kertas uji berubah warna kemerahan, terindikasi mengandung merkuri."
  },
  perlu_uji_lanjut: {
    label: "Perlu Uji Lanjut",
    shortLabel: "Perlu Uji Lanjut",
    chipLabel: "Perlu Uji Lanjut",
    iconSymbol: "●",
    cardBadgeClass: "bg-amber-50 text-amber-700 border border-amber-200/90",
    badgeClass: "bg-amber-50 text-amber-800 border border-amber-200",
    borderClass: "border-amber-200",
    textClass: "text-amber-700",
    dotClass: "bg-amber-500",
    description: "Warna berubah samar atau terpengaruh pewarna bawaan skincare."
  },
  belum_diuji: {
    label: "Belum Diuji",
    shortLabel: "Belum Diuji",
    chipLabel: "Belum Diuji",
    iconSymbol: "?",
    cardBadgeClass: "bg-slate-100 text-slate-600 border border-slate-200",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200",
    borderClass: "border-slate-200",
    textClass: "text-slate-600",
    dotClass: "bg-slate-400",
    description: "Belum ada laporan tes mandiri untuk produk ini."
  }
};

// ============================================================================
// TINGKAT KEPERCAYAAN (Bahasa santai & mudah dimengerti)
// ============================================================================
export const TRUST_LEVEL_CONFIG: Record<TrustLevel, {
  label: string;
  shortLabel: string;
  badgeClass: string;
  icon: string;
  explanation: string;
}> = {
  rendah: {
    label: "Dites 1 orang",
    shortLabel: "1 penguji",
    badgeClass: "bg-slate-100 text-slate-700 border border-slate-200",
    icon: "👤",
    explanation: "Baru dites oleh 1 orang. Perlu pengujian tambahan dari pengguna lain."
  },
  sedang: {
    label: "Dites 2 orang, hasilnya sama",
    shortLabel: "2 penguji cocok",
    badgeClass: "bg-sky-50 text-sky-800 border border-sky-200",
    icon: "👥",
    explanation: "Sudah dites 2 orang berbeda dengan hasil yang konsisten."
  },
  tinggi: {
    label: "Dites 3+ orang, hasilnya sama",
    shortLabel: "Konsisten (3+ orang)",
    badgeClass: "bg-teal-50 text-teal-800 border border-teal-200",
    icon: "🛡️",
    explanation: "Sudah dikonfirmasi 3 orang atau lebih dengan kesimpulan yang sama."
  },
  terverifikasi_lab: {
    label: "Terverifikasi Laboratorium",
    shortLabel: "Validasi Lab",
    badgeClass: "bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold",
    icon: "🔬",
    explanation: "Sudah divalidasi dengan pengujian laboratorium resmi."
  }
};

// ============================================================================
// DISCLAIMER RESMI (Ringkas & Tegas sesuai instruksi poin 3)
// ============================================================================
export const GLOBAL_DISCLAIMER = "Ini hasil skrining awal, bukan pengganti uji laboratorium.";

export const BPOM_OFFICIAL_URL = "https://cekbpom.pom.go.id";
export const BPOM_DISCLAIMER_TEXT = "MERCURY melengkapi, bukan menggantikan BPOM.";

export const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "krim_malam", label: "Krim Malam" },
  { value: "krim_siang", label: "Krim Siang" },
  { value: "serum", label: "Serum Wajah" },
  { value: "sabun", label: "Sabun Cuci Muka" },
  { value: "toner", label: "Toner & Essence" },
  { value: "lotion", label: "Body Lotion" },
  { value: "masker", label: "Masker Wajah" },
  { value: "lainnya", label: "Lainnya" }
];

export const PURCHASE_LOCATION_OPTIONS: { value: string; label: string }[] = [
  { value: "ecommerce", label: "E-Commerce (Shopee, Tokopedia, TikTok Shop)" },
  { value: "toko_offline", label: "Toko Kosmetik Offline" },
  { value: "klinik", label: "Klinik Kecantikan" },
  { value: "media_sosial", label: "Media Sosial (Instagram / TikTok / WA)" },
  { value: "lainnya", label: "Lainnya" }
];
