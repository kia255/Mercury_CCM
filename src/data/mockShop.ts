import { KitPackage } from '../types';

export const TEST_KIT_PACKAGES: KitPackage[] = [
  {
    id: "pkg-1",
    name: "MERCURY Starter Pack",
    stripCount: 1,
    price: 19000,
    originalPrice: 25000,
    description: "Paket uji mandiri ekonomis untuk menguji 1 produk skincare favoritmu di rumah. Praktis dan mudah digunakan.",
    batchCode: "MRC-2026-S01",
    recommended: false,
    inStock: true,
    features: [
      "1x Kertas Uji Sensitif Merkuri",
      "1x Kartu Referensi Kalibrasi Putih",
      "1x Spatula Mini Pengambil Sampel",
      "Akses Scan & Verifikasi Instan MERCURY",
      "Kode Batch Resmi MRC-2026-S01"
    ],
    image: "illustration-starter"
  },
  {
    id: "pkg-5",
    name: "MERCURY Skincare Routine Pack",
    stripCount: 5,
    price: 69000,
    originalPrice: 95000,
    description: "Pilihan paling populer untuk menguji seluruh rangkaian skincare harianmu (krim siang, malam, toner, serum, sabun).",
    batchCode: "MRC-2026-A05",
    recommended: true,
    inStock: true,
    features: [
      "5x Kertas Uji Sensitif Merkuri",
      "2x Kartu Referensi Kalibrasi Putih",
      "5x Spatula Mini & 2x Pipet Transfer",
      "Buku Panduan Uji Mandiri & Skala Warna",
      "Prioritas Kontributor di Hasil Tes Komunitas",
      "Kode Batch Resmi MRC-2026-A05"
    ],
    image: "illustration-routine"
  },
  {
    id: "pkg-10",
    name: "MERCURY Community & Education Pack",
    stripCount: 10,
    price: 119000,
    originalPrice: 169000,
    description: "Dirancang untuk mahasiswa, penggiat edukasi kecantikan, atau klinik untuk skrining berkala banyak produk.",
    batchCode: "MRC-2026-X10",
    recommended: false,
    inStock: true,
    features: [
      "10x Kertas Uji Sensitif Merkuri",
      "4x Kartu Kalibrasi Tahan Air & Pantulan",
      "10x Pipet Mini Disposable",
      "Stiker Segel Sampel & Log Pengujian",
      "Lencana Khusus di Akun MERCURY",
      "Kode Batch Resmi MRC-2026-X10"
    ],
    image: "illustration-community"
  }
];

export const VALID_MERCURY_BATCHES = [
  "MRC-2026-S01",
  "MRC-2026-A01",
  "MRC-2026-A05",
  "MRC-2026-X10",
  "MRC-2026-B02"
];
