import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Check, 
  Camera, 
  QrCode, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  FileCheck2,
  HelpCircle
} from 'lucide-react';
import { KitPackage } from '../../types';
import { HG_TEST_KIT } from '../../data/mockShop';
import { HgTestKitIllustration } from '../illustrations/KitIllustrations';

interface ShopViewProps {
  onAddToCart: (pkg: KitPackage, quantity?: number) => void;
  onNavigateToScan: () => void;
  onOpenCart: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  onAddToCart,
  onNavigateToScan,
  onOpenCart
}) => {
  const [addedToast, setAddedToast] = useState(false);

  const handleAdd = () => {
    onAddToCart(HG_TEST_KIT, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const howToUseSteps = [
    {
      step: '1',
      title: 'Ambil sampel',
      desc: 'Gunakan alat ambil sampel sekali pakai untuk mengambil sedikit krim (seukuran biji jagung).'
    },
    {
      step: '2',
      title: 'Teteskan di zona tetes',
      desc: 'Ratakan sampel secara lembut tepat pada area lingkaran reagen strip uji.'
    },
    {
      step: '3',
      title: 'Tunggu sesuai panduan',
      desc: 'Biarkan reaksi kimia berlangsung selama durasi waktu yang tertera pada panduan bergambar.'
    },
    {
      step: '4',
      title: 'Foto bersama kartu referensi',
      desc: 'Buka kamera scan di web ini dan letakkan strip sejajar dengan kartu referensi warna.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">

      {/* ========================================================================= */}
      {/* 1. SINGLE PRODUCT SECTION: KIRI GAMBAR BESAR, KANAN DETAIL & PEMBELIAN   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* KIRI: GAMBAR PRODUK BESAR (Dengan label kecil "Ilustrasi produk") */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="w-full h-full min-h-[340px] sm:min-h-[400px] lg:min-h-[460px]">
              <HgTestKitIllustration large className="w-full h-full min-h-[340px] sm:min-h-[400px] lg:min-h-[460px]" />
            </div>
          </div>

          {/* KANAN: NAMA, DESKRIPSI, HARGA, JUMLAH, TOMBOL, DAFTAR ISI */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0F4C5C] text-xs font-extrabold border border-teal-200/70">
                  {HG_TEST_KIT.subtitle}
                </span>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Batch: {HG_TEST_KIT.batchCode}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {HG_TEST_KIT.name}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-teal-800/80 mt-0.5">
                  Kit Skrining Mandiri Merkuri (Isi 5 Strip)
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {HG_TEST_KIT.description}
              </p>
            </div>

            {/* HARGA Rp 49.000 */}
            <div className="pt-3 border-t border-slate-100 flex items-baseline">
              <div className="text-3xl sm:text-4xl font-black text-[#0F4C5C] tracking-tight">
                {HG_TEST_KIT.priceDisplay}
              </div>
            </div>

            {/* TOMBOL TAMBAH KE KERANJANG */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAdd}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0F4C5C] hover:bg-[#166479] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-md shadow-[#0F4C5C]/20 hover:shadow-lg active:scale-98 cursor-pointer"
              >
                <ShoppingBag size={20} />
                <span>Tambah ke Keranjang</span>
              </button>

              {addedToast && (
                <p className="text-xs font-bold text-emerald-600 animate-fadeIn flex items-center gap-1.5 pt-1">
                  <Check size={14} className="stroke-[3]" />
                  <span>Hg Test Kit berhasil ditambahkan ke keranjang!</span>
                </p>
              )}
            </div>

            {/* ISI KIT (Daftar centang sesuai spesifikasi) */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Isi Kit:
              </h3>
              <ul className="space-y-2.5">
                {HG_TEST_KIT.features.map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-teal-50 border border-teal-200 text-[#0F4C5C] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BAGIAN "CARA PAKAI" 4 LANGKAH                                          */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Cara Pakai
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            4 langkah praktis dan mudah untuk menguji kosmetik langsung di rumah
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {howToUseSteps.map((stepItem) => (
            <div 
              key={stepItem.step}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 relative overflow-hidden shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center font-black text-sm shadow-xs">
                {stepItem.step}
              </div>
              <h3 className="font-extrabold text-sm text-slate-800">
                {stepItem.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {stepItem.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BAGIAN "KERTAS DARI TEMPAT LAIN?"                                      */}
      {/* ========================================================================= */}
      <div className="bg-[#F0FDF9] border border-teal-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 text-center md:text-left max-w-xl">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-800">
            Kertas dari tempat lain?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            Scan dan unggah hasil tetap gratis untuk semua orang.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToScan}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#E8837A] hover:bg-[#D96F65] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#E8837A]/25 transition-all flex-shrink-0 active:scale-95 cursor-pointer"
        >
          <Camera size={18} />
          <span>Saya sudah punya kertas uji, langsung scan</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. DISCLAIMER SATU BARIS DI BAWAH                                        */}
      {/* ========================================================================= */}
      <div className="text-center py-3.5 px-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
        Hasil MERCURY adalah skrining awal, bukan pengganti uji laboratorium.
      </div>

    </div>
  );
};
