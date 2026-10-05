export type ScreeningStatus = 'negatif' | 'terindikasi' | 'perlu_uji_lanjut' | 'belum_diuji';

export type TrustLevel = 'rendah' | 'sedang' | 'tinggi' | 'terverifikasi_lab';

export type PaperSource = 'mercury' | 'lainnya';

export type ProductCategory = 
  | 'krim_malam' 
  | 'krim_siang' 
  | 'serum' 
  | 'sabun' 
  | 'toner' 
  | 'lotion' 
  | 'masker'
  | 'lainnya';

export type PurchaseLocation = 
  | 'ecommerce' 
  | 'toko_offline' 
  | 'klinik' 
  | 'media_sosial' 
  | 'lainnya';

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface TestResultItem {
  id: string;
  testerName: string;
  testerRole: string;
  date: string;
  paperSource: PaperSource;
  paperBatchCode?: string;
  rgbZone: RGBColor;
  rgbRef: RGBColor;
  rgbNormalized: RGBColor;
  chromaShift: number; // Delta metric
  status: ScreeningStatus;
  estimatedPpmRange: string;
  notes?: string;
  photoUrl: string;
  labVerified?: boolean;
  labReportNumber?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  bpomNumber: string;
  hasBpom: boolean;
  category: ProductCategory;
  categoryLabel: string;
  status: ScreeningStatus;
  trustLevel: TrustLevel;
  testerCount: number;
  lastTestedDate: string;
  thumbnailUrl: string;
  summaryNotes: string;
  tests: TestResultItem[];
  verifiedLabDate?: string;
  pendingVerification?: boolean;
}

export interface KitPackage {
  id: string;
  name: string;
  stripCount: number;
  price: number;
  originalPrice: number;
  description: string;
  batchCode: string;
  features: string[];
  recommended?: boolean;
  inStock: boolean;
  image: string;
}

export interface CartItem {
  packageId: string;
  quantity: number;
}

export interface UserOrder {
  orderId: string;
  date: string;
  items: {
    packageId: string;
    packageName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  paymentMethod: string;
  status: 'diproses' | 'dikirim' | 'selesai';
  trackingNumber: string;
}

export interface UserReport {
  id: string;
  productId: string;
  productName: string;
  reason: 'data_salah' | 'foto_tidak_sesuai' | 'indikasi_spam' | 'merek_keliru' | 'lainnya';
  notes: string;
  reporterContact?: string;
  createdAt: string;
}

export interface ManufacturerObjection {
  id: string;
  productId: string;
  productName: string;
  companyName: string;
  picName: string;
  email: string;
  phone: string;
  officialBpomNumber: string;
  explanation: string;
  documentName?: string;
  status: 'menunggu_peninjauan' | 'diterima' | 'ditolak';
  submittedAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  city?: string;
  initials: string;
  memberId: string;
  joinDate: string;
  testsCount: number;
  bio?: string;
}
