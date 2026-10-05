import React, { useState } from 'react';
import { X, CheckCircle2, Shield, UploadCloud, AlertCircle } from 'lucide-react';
import { 
  PaperSource, 
  ProductCategory, 
  PurchaseLocation, 
  ProductItem, 
  TestResultItem 
} from '../../types';
import { AnalysisCalculationResult } from '../../utils/colorimetry';
import { 
  CATEGORY_OPTIONS, 
  PURCHASE_LOCATION_OPTIONS, 
  GLOBAL_DISCLAIMER 
} from '../../config/constants';
import { StatusBadge } from '../common/StatusBadge';
import { MercuryMascot } from '../illustrations/MercuryMascot';

import { UserAccount } from '../../types';

interface UploadResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisCalculationResult;
  paperSource: PaperSource;
  batchCode?: string;
  photoUrl: string;
  onSaveSuccess: (newProduct: ProductItem) => void;
  currentUser?: UserAccount | null;
}

export const UploadResultModal: React.FC<UploadResultModalProps> = ({
  isOpen,
  onClose,
  analysis,
  paperSource,
  batchCode,
  photoUrl,
  onSaveSuccess,
  currentUser
}) => {
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [hasBpom, setHasBpom] = useState(true);
  const [bpomNumber, setBpomNumber] = useState('');
  const [category, setCategory] = useState<ProductCategory>('krim_malam');
  const [purchaseLocation, setPurchaseLocation] = useState<PurchaseLocation>('ecommerce');
  const [testerNotes, setTesterNotes] = useState('');
  const [testerName, setTesterName] = useState(currentUser?.name || 'Kontributor Komunitas (Anonim)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<ProductItem | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !brand.trim()) return;

    setIsSubmitting(true);

    const testItem: TestResultItem = {
      id: `test-${Date.now()}`,
      testerName: testerName.trim() || 'Teman Komunitas',
      testerRole: paperSource === 'mercury' ? 'Pengguna Kit Resmi' : 'Pengguna Mandiri',
      date: new Date().toISOString().split('T')[0],
      paperSource,
      paperBatchCode: batchCode || (paperSource === 'mercury' ? 'MRC-2026-A01' : undefined),
      rgbZone: analysis.rgbZoneRaw,
      rgbRef: analysis.rgbRefRaw,
      rgbNormalized: analysis.rgbNormalized,
      chromaShift: analysis.chromaShift,
      status: analysis.status,
      estimatedPpmRange: analysis.estimatedPpmRange,
      notes: testerNotes || 'Pengujian mandiri menggunakan aplikasi MERCURY.',
      photoUrl
    };

    const categoryObj = CATEGORY_OPTIONS.find(c => c.value === category);
    const categoryLabel = categoryObj ? categoryObj.label : 'Kosmetik';

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: productName.trim(),
      brand: brand.trim(),
      bpomNumber: hasBpom && bpomNumber.trim() ? bpomNumber.trim() : 'Tidak terdaftar / Tanpa Izin',
      hasBpom: hasBpom && !!bpomNumber.trim(),
      category,
      categoryLabel,
      status: analysis.status,
      trustLevel: 'rendah',
      testerCount: 1,
      lastTestedDate: new Date().toISOString().split('T')[0],
      thumbnailUrl: 'illustration',
      summaryNotes: `Hasil skrining awal: ${analysis.status === 'terindikasi' ? 'Kertas uji berubah kemerahan (terindikasi)' : analysis.status === 'negatif' ? 'Aman (tidak terdeteksi perubahan warna)' : 'Perlu pengujian lanjutan'}.`,
      tests: [testItem],
      pendingVerification: true
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setCreatedProduct(newProd);
      setShowSuccessScreen(true);
      onSaveSuccess(newProd);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#0F4C5C]" />
            <h3 className="font-extrabold text-base text-slate-800">
              {showSuccessScreen ? 'Hasil Berhasil Tersimpan' : 'Unggah Hasil Tes ke Komunitas'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {showSuccessScreen && createdProduct ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <MercuryMascot mood="celebrate" size={64} className="mx-auto" />

            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-slate-800">
                Terima Kasih sudah Berbagi!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Hasil tes untuk <strong className="text-slate-800">{createdProduct.name}</strong> sudah tercatat dan dapat dilihat oleh pengguna lain di menu <strong>Hasil Tes</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700">{createdProduct.name}</span>
                <StatusBadge status={createdProduct.status} size="sm" />
              </div>
              <div className="text-slate-500">Merek: <strong className="text-slate-700">{createdProduct.brand}</strong> · {createdProduct.bpomNumber}</div>
            </div>

            <div className="py-2.5 px-3 bg-slate-100 rounded-xl text-center text-xs text-slate-600 font-medium">
              ⚠️ {GLOBAL_DISCLAIMER}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-2xl bg-[#0F4C5C] text-white text-xs font-bold hover:bg-[#166479] transition-colors"
              >
                Lihat di Halaman Hasil Tes
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Metadata Summary Banner */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-300 bg-slate-200 flex-shrink-0">
                  <img src={photoUrl} alt="Foto Kertas Uji" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase">Hasil Tes Terbaca</div>
                  <div className="text-xs font-bold text-slate-800">ΔE {analysis.chromaShift} · {analysis.estimatedPpmRange}</div>
                </div>
              </div>
              <StatusBadge status={analysis.status} size="sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Skincare <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Misal: Glow Cream Malam Pencerah"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4C5C] focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Merek / Brand <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Misal: Glow Derm"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4C5C] focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* BPOM Toggle */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Status Nomor BPOM</span>
                <div className="flex gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setHasBpom(true)}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${hasBpom ? 'bg-[#0F4C5C] text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    Ada BPOM
                  </button>
                  <button
                    type="button"
                    onClick={() => { setHasBpom(false); setBpomNumber(''); }}
                    className={`px-3 py-1 rounded-lg font-bold transition-colors ${!hasBpom ? 'bg-[#0F4C5C] text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    Belum Terdaftar
                  </button>
                </div>
              </div>

              {hasBpom && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={bpomNumber}
                    onChange={(e) => setBpomNumber(e.target.value)}
                    placeholder="Contoh: NA18230104821"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4C5C] outline-none font-mono uppercase"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kategori Skincare
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4C5C] outline-none bg-white font-medium"
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tempat Membeli
                </label>
                <select
                  value={purchaseLocation}
                  onChange={(e) => setPurchaseLocation(e.target.value as PurchaseLocation)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4C5C] outline-none bg-white font-medium"
                >
                  {PURCHASE_LOCATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Pengujian (Opsional)
              </label>
              <textarea
                rows={2}
                value={testerNotes}
                onChange={(e) => setTesterNotes(e.target.value)}
                placeholder="Tekstur krim, perubahan warna, atau aroma..."
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#0F4C5C] outline-none"
              />
            </div>

            {/* One-line disclaimer */}
            <div className="py-2 px-3 bg-slate-100 rounded-xl text-center text-[11px] text-slate-600 font-medium">
              ⚠️ {GLOBAL_DISCLAIMER}
            </div>

            <div className="flex gap-2.5 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#0F4C5C] text-white text-xs font-bold hover:bg-[#166479] disabled:opacity-50 transition-colors shadow-sm"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan ke Hasil Tes'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
