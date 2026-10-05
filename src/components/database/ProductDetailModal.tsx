import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  Flag, 
  Building2, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { ProductItem } from '../../types';
import { StatusBadge, TrustBadge } from '../common/StatusBadge';
import { BPOM_OFFICIAL_URL, GLOBAL_DISCLAIMER } from '../../config/constants';
import { SkincarePlaceholder } from '../illustrations/SkincarePlaceholder';
import { MercuryMascot } from '../illustrations/MercuryMascot';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onOpenReport: (product: ProductItem) => void;
  onOpenObjection: (product: ProductItem) => void;
  onTestThisProduct: (product: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onOpenReport,
  onOpenObjection,
  onTestThisProduct
}) => {
  if (!isOpen || !product) return null;

  // Mascot mood based on product status
  const mascotMood = 
    product.status === 'terindikasi' ? 'alert' :
    product.status === 'negatif' ? 'happy' : 'curious';

  const friendlyAdvice = 
    product.status === 'terindikasi' ? 'Hati-hati ya! Reaksinya kemerahan, terindikasi merkuri. Sebaiknya hentikan dulu pemakaiannya.' :
    product.status === 'negatif' ? 'Kabar baik! Kertas uji tidak menunjukkan perubahan warna, aman dari indikasi merkuri.' :
    'Warnanya agak samar, mungkin karena pigmen skincare. Disarankan tes ulang untuk memastikan.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 bg-slate-50/70">
          <div className="flex items-center gap-3.5 pr-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xs flex-shrink-0">
              <SkincarePlaceholder category={product.category} categoryLabel={product.categoryLabel} seed={product.id} className="w-full h-full" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {product.brand} · {product.categoryLabel}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
                {product.name}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors flex-shrink-0 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          
          {/* Status & Trust Overview Banner (Clean & bold) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Status Hasil Tes Komunitas
              </span>
              <div>
                <StatusBadge status={product.status} size="lg" showDescription />
              </div>
            </div>

            <div className="space-y-1 text-left sm:text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tingkat Kepercayaan
              </span>
              <div>
                <TrustBadge level={product.trustLevel} size="md" />
              </div>
              <div className="text-[11px] text-slate-500 pt-0.5 font-medium">
                Dites oleh {product.testerCount} orang
              </div>
            </div>
          </div>

          {/* Friendly Mascot Advice Callout */}
          <div className="p-4 rounded-2xl bg-teal-50/60 flex items-center gap-3.5">
            <MercuryMascot mood={mascotMood} size={48} className="flex-shrink-0" />
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {friendlyAdvice}
            </p>
          </div>

          {/* BPOM Verification Box */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className={product.hasBpom ? "text-emerald-600" : "text-slate-400"} />
              <div>
                <span className="text-slate-500">Nomor Izin BPOM: </span>
                <span className="font-mono font-bold text-slate-800">{product.bpomNumber}</span>
              </div>
            </div>

            <a
              href={BPOM_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#0F4C5C] hover:underline"
            >
              <span>Cek di BPOM</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Tester Timeline with Social Avatars */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Riwayat Tes ({product.tests.length} Teman Menguji)
            </h4>

            {product.tests.length === 0 ? (
              <div className="text-center p-8 rounded-3xl bg-slate-50 space-y-2">
                <MercuryMascot mood="curious" size={48} className="mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  Belum ada yang mengunggah foto tes untuk produk ini.
                </p>
                <button
                  onClick={() => { onClose(); onTestThisProduct(product); }}
                  className="px-5 py-2.5 rounded-xl bg-[#E8837A] text-white text-xs font-bold hover:bg-[#D96F65] cursor-pointer active:scale-95"
                >
                  Yuk Jadi yang Pertama Tes
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {product.tests.map((test, index) => {
                  const parts = test.testerName.replace(/[^a-zA-Z\s]/g, '').trim().split(' ');
                  const initials = parts.length >= 2 
                    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() 
                    : parts[0].slice(0, 2).toUpperCase();

                  return (
                    <div 
                      key={test.id || index}
                      className="p-4 rounded-2xl bg-slate-50/80 space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-200/60">
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-teal-100 text-[#0F4C5C] flex items-center justify-center text-[10px] font-black">
                            {initials}
                          </span>
                          <span>{test.testerName}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] font-medium flex items-center gap-2">
                          <span>{test.date}</span>
                          <span>·</span>
                          <span className="font-semibold text-[#0F4C5C]">
                            {test.paperSource === 'mercury' ? 'Kit Resmi' : 'Kertas Mandiri'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-7 h-7 rounded-lg shadow-inner flex-shrink-0 border border-slate-300"
                            style={{
                              backgroundColor: `rgb(${test.rgbNormalized.r}, ${test.rgbNormalized.g}, ${test.rgbNormalized.b})`
                            }}
                          />
                          <div className="font-mono text-[11px] text-slate-700 font-semibold">
                            ΔE {test.chromaShift} · RGB ({test.rgbNormalized.r}, {test.rgbNormalized.g}, {test.rgbNormalized.b})
                          </div>
                        </div>

                        <StatusBadge status={test.status} size="sm" />
                      </div>

                      {test.notes && (
                        <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl leading-relaxed font-medium">
                          "{test.notes}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ONE-LINE COMPACT DISCLAIMER IN PRODUCT DETAIL */}
          <div className="py-2.5 px-4 bg-slate-100 rounded-xl text-xs text-slate-600 text-center font-medium">
            ⚠️ {GLOBAL_DISCLAIMER}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onOpenReport(product)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-slate-200/60 font-semibold transition-colors cursor-pointer"
            >
              <Flag size={14} />
              <span>Laporkan Data</span>
            </button>

            <button
              onClick={() => onOpenObjection(product)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0F4C5C] px-3 py-2 rounded-xl hover:bg-slate-200/60 font-semibold transition-colors cursor-pointer"
            >
              <Building2 size={14} />
              <span>Sanggahan Produsen</span>
            </button>
          </div>

          <button
            onClick={() => { onClose(); onTestThisProduct(product); }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#E8837A] hover:bg-[#D96F65] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Tes Skincare Ini</span>
          </button>
        </div>

      </div>
    </div>
  );
};
