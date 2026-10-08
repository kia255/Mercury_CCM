import { KitPackage } from '../types';

export interface SingleProductKit extends KitPackage {
  subtitle: string;
  priceDisplay: string;
}

export const HG_TEST_KIT: SingleProductKit = {
  id: "hg-test-kit",
  name: "Hg Test Kit",
  subtitle: "Isi 5 strip",
  stripCount: 5,
  price: 49000,
  originalPrice: 49000,
  priceDisplay: "Rp 49.000",
  description: "Satu kit untuk mengecek satu rangkaian skincare-mu: krim siang, krim malam, toner, serum, dan sabun. Hasil berupa skrining awal, bukan pengganti uji laboratorium.",
  batchCode: "MRC-2026-A05",
  recommended: false,
  inStock: true,
  features: [
    "5 strip kertas uji merkuri",
    "2 kartu referensi warna",
    "5 alat ambil sampel sekali pakai",
    "Panduan bergambar dan skala warna",
    "Kode batch dan QR"
  ],
  image: "illustration-hg-test-kit"
};

export const TEST_KIT_PACKAGES: KitPackage[] = [
  HG_TEST_KIT
];

export const VALID_MERCURY_BATCHES = [
  "MRC-2026-A05",
  "MRC-2026-S01",
  "MRC-2026-A01",
  "MRC-2026-X10",
  "MRC-2026-B02"
];
