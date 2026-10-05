import React from 'react';
import { 
  ShoppingBag, 
  Check, 
  Camera, 
  Info, 
  Sparkles 
} from 'lucide-react';
import { KitPackage } from '../../types';
import { TEST_KIT_PACKAGES } from '../../data/mockShop';
import { KitIllustration } from '../illustrations/KitIllustrations';

interface ShopViewProps {
  onAddToCart: (pkg: KitPackage) => void;
  onNavigateToScan: () => void;
  onOpenCart: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  onAddToCart,
  onNavigateToScan,
  onOpenCart
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Beli Kertas Uji Skincare
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Dapatkan paket kertas uji resmi untuk mengetes skincare langsung di rumah.
        </p>
      </div>

      {/* PROMINENT NOTICE: SAYA SUDAH PUNYA KERTAS UJI */}
      <div className="bg-[#F0FDF9] border border-teal-200/90 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
            Sudah punya kertas uji sendiri?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
            Membeli kertas di MERCURY tidak wajib. Kamu bisa memakai kertas dari sumber lain dan tetap bisa discan gratis di web ini!
          </p>
        </div>

        <button
          onClick={onNavigateToScan}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#E8837A] hover:bg-[#D96F65] text-white text-xs sm:text-sm font-extrabold shadow-md transition-all flex-shrink-0 active:scale-95"
        >
          <Camera size={18} />
          <span>Saya Sudah Punya Kertas Uji &rarr; Scan</span>
        </button>
      </div>

      {/* PACKAGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {TEST_KIT_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-3xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
              pkg.recommended 
                ? 'border-[#0F4C5C] ring-2 ring-[#0F4C5C]/20' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {pkg.recommended && (
              <div className="bg-[#0F4C5C] text-white text-[11px] font-extrabold text-center py-1.5 uppercase tracking-wider">
                Paling Populer & Hemat
              </div>
            )}

            <div className="p-6 space-y-5">
              
              {/* Vector SVG/CSS Kit Illustration */}
              <div className="space-y-3">
                <div className="h-44 rounded-2xl overflow-hidden border border-slate-100">
                  <KitIllustration packageId={pkg.id} className="w-full h-full" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase mb-1">
                    <span>Isi {pkg.stripCount} Kertas Tes</span>
                    <span className="text-[#0F4C5C] font-mono">{pkg.batchCode}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800 leading-snug">
                    {pkg.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {pkg.description}
                </p>
              </div>

              {/* Price */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#0F4C5C]">
                    Rp{pkg.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    Rp{pkg.originalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-2 pt-1 border-t border-slate-100">
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                    <Check size={14} className="text-[#0F4C5C] flex-shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

            </div>

            {/* Action Card Button */}
            <div className="p-6 pt-0 mt-auto">
              <button
                onClick={() => onAddToCart(pkg)}
                className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                  pkg.recommended
                    ? 'bg-[#0F4C5C] hover:bg-[#166479] text-white'
                    : 'bg-slate-100 hover:bg-[#0F4C5C] text-slate-800 hover:text-white'
                }`}
              >
                <ShoppingBag size={16} />
                <span>Tambah ke Keranjang</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
