import React, { useState } from 'react';
import { 
  Camera, 
  ShoppingBag, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Heart,
  Droplet,
  CheckCircle2
} from 'lucide-react';
import { ProductItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { BPOM_OFFICIAL_URL, BPOM_DISCLAIMER_TEXT } from '../../config/constants';
import { SkincarePlaceholder } from '../illustrations/SkincarePlaceholder';
import { MercuryMascot } from '../illustrations/MercuryMascot';
import { MercuryLogo } from '../common/MercuryLogo';

interface HomeViewProps {
  products: ProductItem[];
  onNavigate: (tab: string) => void;
  onSearchSubmit: (query: string) => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onNavigate,
  onSearchSubmit,
  onSelectProduct
}) => {
  const [searchInput, setSearchInput] = useState('');

  const totalTested = products.reduce((acc, p) => acc + p.testerCount, 0) + 142;
  const indicatedCount = products.filter(p => p.status === 'terindikasi').length * 11 + 5;
  const negativeCount = products.filter(p => p.status === 'negatif').length * 28 + 19;
  const contributorCount = 148;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchSubmit(searchInput.trim());
      onNavigate('database');
    } else {
      onNavigate('database');
    }
  };

  const previewProducts = products.slice(0, 4);

  return (
    <div className="space-y-14 sm:space-y-20 pb-16 overflow-hidden">
      
      {/* 1. HERO SECTION WITH CURVED WAVE & CORAL MARKER HIGHLIGHT */}
      <section className="relative bg-[#0F4C5C] text-white pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden">
        {/* Playful atmospheric light spots */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#E8837A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          
          {/* Logo Brand Showcase & Friendly Greeting */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-md inline-flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <MercuryLogo variant="full" colorMode="light" size={48} />
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-teal-100 animate-fadeIn">
              <MercuryMascot mood="wave" size={22} />
              <span>Hai! Yuk pastikan skincare-mu bebas merkuri dulu</span>
            </div>
          </div>

          {/* Very Large & Bold Headline with Coral Marker / Brush Underline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.12]">
            <span className="relative inline-block">
              <span className="relative z-10">Cek Merkuri Skincare-mu.</span>
              <span className="absolute bottom-2 sm:bottom-3 left-0 right-0 h-3 sm:h-5 bg-[#E8837A] -rotate-1 rounded-sm -z-0 opacity-80" />
            </span>
            <br />
            <span className="text-teal-200">Aman Sebelum Checkout.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-200 font-medium leading-relaxed">
            Foto kertas uji dengan HP, warnanya langsung terbaca. Simpan hasilnya di daftar komunitas biar kita saling jaga.
          </p>

          {/* Big Rounded Search Input */}
          <div className="max-w-2xl mx-auto pt-2">
            <form onSubmit={handleSearch} className="relative flex items-center shadow-2xl rounded-full sm:rounded-2xl bg-white p-2">
              <Search className="w-5 h-5 text-slate-400 ml-4 flex-shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari skincare, merek, atau nomor BPOM"
                className="w-full px-3 py-3.5 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent font-medium"
              />
              <button
                type="submit"
                className="px-7 py-3 rounded-full sm:rounded-xl bg-[#0F4C5C] hover:bg-[#166479] text-white text-sm font-extrabold transition-all flex-shrink-0 active:scale-95 cursor-pointer shadow-sm"
              >
                Cari
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-xs text-teal-100/90 pt-3 font-medium">
              <span>Sering dicari:</span>
              <button onClick={() => { setSearchInput('GlowNova'); onSearchSubmit('GlowNova'); onNavigate('database'); }} className="underline hover:text-white cursor-pointer">GlowNova</button>
              <span>·</span>
              <button onClick={() => { setSearchInput('AuraVelvet'); onSearchSubmit('AuraVelvet'); onNavigate('database'); }} className="underline hover:text-white cursor-pointer">AuraVelvet</button>
              <span>·</span>
              <button onClick={() => { setSearchInput('Lumina'); onSearchSubmit('Lumina'); onNavigate('database'); }} className="underline hover:text-white cursor-pointer">Lumina Serum</button>
            </div>
          </div>

          {/* Action Buttons with tactile press effect */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => onNavigate('scan')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-black text-white bg-[#E8837A] hover:bg-[#D96F65] shadow-xl shadow-[#E8837A]/35 transition-all transform active:scale-95 cursor-pointer"
            >
              <Camera size={21} />
              <span>Scan Kertas Uji Sekarang</span>
            </button>

            <button
              onClick={() => onNavigate('toko')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag size={19} />
              <span>Beli Kertas Uji</span>
            </button>
          </div>

        </div>

        {/* ORGANIC CURVED SVG BOTTOM SEPARATOR */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8 sm:h-14 text-[#F8FAFC] fill-current">
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. STATS SECTION (Soft elevated pills, no aggressive bordered grid) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          
          <div className="space-y-1 text-center sm:text-left pt-2 sm:pt-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Dites</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-800">{totalTested}</p>
            <p className="text-xs text-slate-500 font-medium">skincare dilaporkan</p>
          </div>

          <div className="space-y-1 text-center sm:text-left sm:pl-6 pt-2 sm:pt-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Terindikasi</span>
            <p className="text-2xl sm:text-3xl font-black text-rose-600">{indicatedCount}</p>
            <p className="text-xs text-slate-500 font-medium">terdeteksi merkuri</p>
          </div>

          <div className="space-y-1 text-center sm:text-left sm:pl-6 pt-2 sm:pt-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Aman</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">{negativeCount}</p>
            <p className="text-xs text-slate-500 font-medium">lolos batas uji</p>
          </div>

          <div className="space-y-1 text-center sm:text-left sm:pl-6 pt-2 sm:pt-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F4C5C]">Teman Penguji</span>
            <p className="text-2xl sm:text-3xl font-black text-[#0F4C5C]">{contributorCount}+</p>
            <p className="text-xs text-slate-500 font-medium">kontributor aktif</p>
          </div>

        </div>
      </section>

      {/* 3. CARA KERJA (STAGGERED / STACKED CARDS EFFECT) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C5C]">
              Mudah & Praktis
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              Gimana Cara Kerjanya?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm font-medium">
            Nggak butuh alat laboratorium rumit. Cukup 2 menit di rumah sebelum buka segel skincare barumu.
          </p>
        </div>

        {/* Stacked / Staggered Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          <div className="bg-white rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-3 relative group">
            <div className="w-11 h-11 rounded-2xl bg-[#0F4C5C] text-white flex items-center justify-center font-black text-base shadow-xs">
              1
            </div>
            <h3 className="font-extrabold text-base text-slate-800">Siapkan Kertas Uji</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Taruh strip uji di atas meja beralas putih bersama kartu referensi.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-3 relative group sm:translate-y-2">
            <div className="w-11 h-11 rounded-2xl bg-[#0F4C5C] text-white flex items-center justify-center font-black text-base shadow-xs">
              2
            </div>
            <h3 className="font-extrabold text-base text-slate-800">Oles Sedikit Sampel</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Ambil seujung spatula krim atau serum, ratakan di lingkaran uji. Tunggu 60 detik.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-3 relative group sm:-translate-y-1">
            <div className="w-11 h-11 rounded-2xl bg-[#0F4C5C] text-white flex items-center justify-center font-black text-base shadow-xs">
              3
            </div>
            <h3 className="font-extrabold text-base text-slate-800">Jepret Lewat MERCURY</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Buka menu Scan. Algoritma kami akan membaca rona warna secara objektif.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-3 relative group sm:translate-y-2">
            <div className="w-11 h-11 rounded-2xl bg-[#E8837A] text-white flex items-center justify-center font-black text-base shadow-xs">
              4
            </div>
            <h3 className="font-extrabold text-base text-slate-800">Masuk ke Hasil Tes</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Hasil langsung keluar dan tersimpan agar teman lain bisa mengeceknya juga.
            </p>
          </div>

        </div>
      </section>

      {/* 4. SLANTED SECTION: CEK LEGALITAS BPOM (ANGLED BLOCK DIVIDER) */}
      <section className="relative my-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Background sparkle accent */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-2 text-center md:text-left max-w-xl relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold">
                <ShieldCheck size={14} />
                <span>Otoritas Resmi BPOM RI</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                MERCURY Melengkapi, Bukan Menggantikan BPOM.
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                Selalu pastikan skincare-mu memiliki izin edar resmi dari Badan POM sebelum rutin dipakai sehari-hari.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 flex-shrink-0 relative z-10">
              <MercuryMascot mood="happy" size={60} />
              <a
                href={BPOM_OFFICIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm bg-white text-emerald-950 hover:bg-emerald-50 transition-all active:scale-95 shadow-md cursor-pointer"
              >
                <span>Cek Nomor di BPOM</span>
                <ExternalLink size={15} />
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* 5. HASIL TES TERKINI DENGAN SOCIAL ATTRIBUTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C5C]">
              Skincare Komunitas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              Baru Saja Dites oleh Teman-Teman
            </h2>
          </div>

          <button
            onClick={() => onNavigate('database')}
            className="text-xs sm:text-sm font-extrabold text-[#0F4C5C] hover:text-[#166479] flex items-center gap-1 group cursor-pointer"
          >
            <span>Buka Semua Hasil Tes</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {previewProducts.map((product) => {
            const firstTester = product.tests?.[0]?.testerName.split(' ')[0] || "Teman";
            const othersCount = product.testerCount - 1;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-white rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group active:scale-[0.98]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SkincarePlaceholder
                    category={product.category}
                    categoryLabel={product.categoryLabel}
                    seed={product.id}
                    className="w-full h-full"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-white text-[10px] font-semibold">
                    {product.categoryLabel}
                  </span>
                </div>

                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <StatusBadge status={product.status} size="prominent" />
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                      {product.brand}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-800 leading-snug group-hover:text-[#0F4C5C] line-clamp-2">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                    {othersCount > 0 ? `Dites oleh ${firstTester} & ${othersCount} lainnya` : `Dites oleh ${firstTester}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
