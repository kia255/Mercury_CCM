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
  HelpCircle,
  ZoomIn,
  X
} from 'lucide-react';
import { KitPackage } from '../../types';
import { HG_TEST_KIT } from '../../data/mockShop';

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
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);

  const productPhotoUrl = "/Hg_Test_Kit_Web.png";
  const fallbackPhotoUrl = "/hg-test-kit.png";

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
          
          {/* KIRI: FOTO PRODUK ASLI RESMI (Uncropped / Tidak Terpotong) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div 
              onClick={() => setIsPhotoZoomed(true)}
              className="relative w-full rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/90 p-4 sm:p-6 lg:p-8 flex items-center justify-center cursor-zoom-in group transition-all hover:border-teal-300 hover:shadow-md overflow-hidden"
              title="Klik untuk memperbesar foto produk"
            >
              {/* Badge Foto Resmi Produk */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-[11px] font-bold text-slate-700 border border-slate-200/90 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Foto Resmi Hg Test Kit</span>
              </div>

              {/* Tombol Perbesar Foto */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-[11px] font-bold text-slate-700 border border-slate-200/90 shadow-xs flex items-center gap-1.5 group-hover:bg-[#0F4C5C] group-hover:text-white transition-colors">
                <ZoomIn size={14} />
                <span>Perbesar Foto</span>
              </div>

              {/* Gambar Produk */}
              <div className="w-full flex items-center justify-center min-h-[300px] sm:min-h-[380px] lg:min-h-[440px]">
                <img
                  src={productPhotoUrl}
                  alt="Hg Test Kit MERCURY - 5 Strip Uji Merkuri Lengkap"
                  className="w-full h-auto max-h-[360px] sm:max-h-[420px] lg:max-h-[460px] object-contain rounded-xl drop-shadow-sm select-none transition-transform duration-300 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = fallbackPhotoUrl;
                  }}
                />
              </div>
            </div>
            
            <p className="text-center text-[11px] text-slate-400 font-medium mt-2">
              Foto menampilkan seluruh kelengkapan isi kit: kemasan pelindung, 5 strip uji merkuri, kartu skala komparasi warna, dan pipet/spatula sampel.
            </p>
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

      {/* ========================================================================= */}
      {/* 5. LIGHTBOX / MODAL FOTO UTUH TANPA TERPOTONG                             */}
      {/* ========================================================================= */}
      {isPhotoZoomed && (
        <div 
          onClick={() => setIsPhotoZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200/80 flex flex-col items-center gap-4 cursor-default"
          >
            {/* Header modal */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                  Foto Resmi Hg Test Kit (Tampilan Lengkap)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoZoomed(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup foto"
              >
                <X size={20} />
              </button>
            </div>

            {/* Foto Utuh Besar Resolusi Penuh */}
            <div className="w-full bg-slate-50 rounded-2xl border border-slate-200/80 p-2 sm:p-4 flex items-center justify-center overflow-hidden max-h-[75vh]">
              <img
                src={productPhotoUrl}
                alt="Hg Test Kit MERCURY - 5 Strip Uji Merkuri Lengkap"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl select-none"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = fallbackPhotoUrl;
                }}
              />
            </div>

            {/* Keterangan detail isi */}
            <div className="w-full flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Isi: 5 strip uji, 2 kartu referensi, 5 alat sampling sekali pakai</span>
              <button
                type="button"
                onClick={() => setIsPhotoZoomed(false)}
                className="font-bold text-[#0F4C5C] hover:underline cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
