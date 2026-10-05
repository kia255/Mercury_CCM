import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  PlusCircle, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ProductItem, ScreeningStatus, TrustLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { STATUS_CONFIG, TRUST_LEVEL_CONFIG } from '../../config/constants';
import { SkincarePlaceholder } from '../illustrations/SkincarePlaceholder';
import { MercuryMascot } from '../illustrations/MercuryMascot';

interface DatabaseViewProps {
  products: ProductItem[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  onNavigateToScan: () => void;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  products,
  searchQuery,
  onSearchChange,
  onSelectProduct,
  onNavigateToScan
}) => {
  const [activeChip, setActiveChip] = useState<string>('all');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [selectedBpom, setSelectedBpom] = useState<string>('all');
  const [selectedTrust, setSelectedTrust] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'most_tested' | 'trust'>('latest');

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand))).sort();
  }, [products]);

  // Featured Spotlight Product: Find the product with highest tester count
  const spotlightProduct = useMemo(() => {
    if (products.length === 0) return null;
    return [...products].sort((a, b) => b.testerCount - a.testerCount)[0];
  }, [products]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesBpom = item.bpomNumber.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesBpom) return false;
      }

      if (activeChip !== 'all' && item.status !== activeChip) {
        return false;
      }

      if (selectedBpom === 'has_bpom' && !item.hasBpom) return false;
      if (selectedBpom === 'no_bpom' && item.hasBpom) return false;

      if (selectedTrust !== 'all' && item.trustLevel !== selectedTrust) return false;
      if (selectedBrand !== 'all' && item.brand !== selectedBrand) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'most_tested') {
        return b.testerCount - a.testerCount;
      }
      if (sortBy === 'trust') {
        const order: Record<TrustLevel, number> = {
          'terverifikasi_lab': 4,
          'tinggi': 3,
          'sedang': 2,
          'rendah': 1
        };
        return (order[b.trustLevel] || 0) - (order[a.trustLevel] || 0);
      }
      return new Date(b.lastTestedDate).getTime() - new Date(a.lastTestedDate).getTime();
    });
  }, [products, searchQuery, activeChip, selectedBpom, selectedTrust, selectedBrand, sortBy]);

  const resetAllFilters = () => {
    onSearchChange('');
    setActiveChip('all');
    setSelectedBpom('all');
    setSelectedTrust('all');
    setSelectedBrand('all');
    setSortBy('latest');
  };

  const hasExtraFilters = selectedBpom !== 'all' || selectedTrust !== 'all' || selectedBrand !== 'all' || sortBy !== 'latest';

  // Helper for warm, human attribution with tester initials
  const getSocialAttribution = (item: ProductItem) => {
    if (item.tests && item.tests.length > 0) {
      const firstTester = item.tests[0].testerName.split(' ')[0]; // First name, e.g. "Alya", "Budi"
      const othersCount = item.testerCount - 1;
      
      const initials = item.tests.slice(0, 2).map(t => {
        const parts = t.testerName.replace(/[^a-zA-Z\s]/g, '').trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return parts[0].slice(0, 2).toUpperCase();
      });

      const label = othersCount > 0 
        ? `Dites oleh ${firstTester} & ${othersCount} teman`
        : `Dites oleh ${firstTester}`;

      return { label, initials };
    }

    return {
      label: "Belum ada yang tes, mau jadi yang pertama?",
      initials: []
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* Page Header (Clean, human, bold) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
              Hasil Tes dari Komunitas
            </h1>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Data contoh
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Cek dulu skincare-mu sebelum checkout. Biar kulit tetap tenang.
          </p>
        </div>

        <button
          onClick={onNavigateToScan}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#E8837A] hover:bg-[#D96F65] text-white text-sm font-extrabold shadow-lg shadow-[#E8837A]/25 transition-all transform active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle size={18} />
          <span>Tambah Hasil Tes</span>
        </button>
      </div>

      {/* SEARCH BAR & STATUS CHIPS (Soft shadows, no aggressive borders) */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari skincare, merek, atau nomor BPOM"
              className="w-full pl-12 pr-10 py-3.5 text-sm sm:text-base text-slate-800 bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-[#0F4C5C] focus:outline-none placeholder:text-slate-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Hapus pencarian"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-sm flex-shrink-0 cursor-pointer active:scale-95 ${
              hasExtraFilters
                ? 'bg-[#0F4C5C] text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={17} />
            <span className="hidden sm:inline">Filter</span>
            {hasExtraFilters && (
              <span className="w-2 h-2 rounded-full bg-[#E8837A]"></span>
            )}
          </button>
        </div>

        {/* Tappable Status Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveChip('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeChip === 'all'
                ? 'bg-[#0F4C5C] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 shadow-xs'
            }`}
          >
            Semua
          </button>

          <button
            onClick={() => setActiveChip('negatif')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeChip === 'negatif'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Check size={14} className="stroke-[3]" />
            <span>Aman</span>
          </button>

          <button
            onClick={() => setActiveChip('terindikasi')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeChip === 'terindikasi'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle size={14} className="stroke-[2.5]" />
            <span>Terindikasi</span>
          </button>

          <button
            onClick={() => setActiveChip('perlu_uji_lanjut')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeChip === 'perlu_uji_lanjut'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span>●</span>
            <span>Perlu Uji Lanjut</span>
          </button>

          {hasExtraFilters && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-[#E8837A] hover:underline font-bold px-2 whitespace-nowrap flex items-center gap-1 ml-auto cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset filter</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. KARTU SOROTAN BESAR ("PALING SERING DITES MINGGU INI") */}
      {/* Non-uniform layout: a wide, friendly spotlight card break */}
      {spotlightProduct && activeChip === 'all' && !searchQuery && (
        <div 
          onClick={() => onSelectProduct(spotlightProduct)}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-50 via-white to-emerald-50 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.99]"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4C5C] text-white text-[11px] font-extrabold">
                <Sparkles size={13} className="text-teal-200" />
                <span>Paling Sering Dites Minggu Ini</span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  {spotlightProduct.brand}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug group-hover:text-[#0F4C5C] transition-colors">
                  {spotlightProduct.name}
                </h3>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3">
                <StatusBadge status={spotlightProduct.status} size="md" />
                <span className="text-xs font-semibold text-slate-500">
                  {spotlightProduct.hasBpom ? "✓ Terdaftar BPOM" : "Belum ada BPOM"}
                </span>
              </div>

              {/* Social attribution in spotlight */}
              <div className="flex items-center justify-center md:justify-start gap-2 pt-1 text-xs text-slate-600 font-medium">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    AL
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#E8837A] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    RF
                  </div>
                </div>
                <span>Dites oleh <strong>Alya, Rizky,</strong> dan {spotlightProduct.testerCount - 2} orang lainnya</span>
              </div>
            </div>

            {/* Right side illustration and CTA */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="w-36 h-28 sm:w-44 sm:h-32 rounded-2xl overflow-hidden shadow-xs">
                <SkincarePlaceholder
                  category={spotlightProduct.category}
                  categoryLabel={spotlightProduct.categoryLabel}
                  seed={spotlightProduct.id}
                  className="w-full h-full"
                />
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F4C5C] group-hover:translate-x-1 transition-transform">
                <span>Lihat riwayat lengkap</span>
                <ArrowRight size={14} />
              </span>
            </div>

          </div>
        </div>
      )}

      {/* PRODUCT GRID: 2 Kolom di Mobile, 3-4 Kolom di Desktop (Warm, soft contrast, reduced harsh borders) */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl p-8 space-y-4 shadow-xs">
          <MercuryMascot mood="curious" size={80} className="mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-800">
              Belum ada yang tes skincare ini nih
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium">
              Mau jadi yang pertama mengetes dan membagikannya ke teman-teman?
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={resetAllFilters}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer active:scale-95"
            >
              Reset Filter
            </button>
            <button
              onClick={onNavigateToScan}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#E8837A] hover:bg-[#D96F65] rounded-xl shadow-sm cursor-pointer active:scale-95"
            >
              Tes Produk Ini Sekarang
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((product) => {
            const social = getSocialAttribution(product);

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-white rounded-3xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group active:scale-[0.98]"
              >
                {/* 1. THUMBNAIL ILUSTRASI VEKTOR DI ATAS */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SkincarePlaceholder
                    category={product.category}
                    categoryLabel={product.categoryLabel}
                    seed={product.id}
                    className="w-full h-full"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide">
                    {product.categoryLabel}
                  </span>
                </div>

                {/* 2. CARD CONTENT */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  
                  {/* Status label besar & jelas */}
                  <div>
                    <StatusBadge status={product.status} size="prominent" />
                  </div>

                  {/* Brand & Product Name */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                      {product.brand}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug group-hover:text-[#0F4C5C] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </div>

                  {/* 3. SOCIAL ATTRIBUTION & BPOM */}
                  <div className="pt-2 border-t border-slate-100/80 space-y-1.5 text-xs">
                    
                    {/* Social Avatars + Friend Attribution */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                      {social.initials.length > 0 && (
                        <div className="flex -space-x-1 flex-shrink-0">
                          {social.initials.map((init, i) => (
                            <span 
                              key={i} 
                              className="w-4 h-4 rounded-full bg-teal-100 text-[#0F4C5C] text-[8px] font-extrabold flex items-center justify-center ring-1 ring-white"
                            >
                              {init}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="truncate">{social.label}</span>
                    </div>

                    {/* Penanda BPOM sederhana */}
                    <div className="flex items-center gap-1 text-[11px]">
                      {product.hasBpom ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <ShieldCheck size={12} className="stroke-[2.5]" />
                          <span>Terdaftar BPOM</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">
                          Belum terdaftar BPOM
                        </span>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* FILTER BOTTOM SHEET / MODAL */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-slideUp">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-800">Filter Hasil Tes</h3>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Status BPOM</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedBpom('all')}
                    className={`py-2.5 px-3 rounded-2xl font-bold transition-all cursor-pointer active:scale-95 ${selectedBpom === 'all' ? 'bg-[#0F4C5C] text-white shadow-xs' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBpom('has_bpom')}
                    className={`py-2.5 px-3 rounded-2xl font-bold transition-all cursor-pointer active:scale-95 ${selectedBpom === 'has_bpom' ? 'bg-[#0F4C5C] text-white shadow-xs' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Ada BPOM
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBpom('no_bpom')}
                    className={`py-2.5 px-3 rounded-2xl font-bold transition-all cursor-pointer active:scale-95 ${selectedBpom === 'no_bpom' ? 'bg-[#0F4C5C] text-white shadow-xs' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Tanpa BPOM
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Berdasarkan Merek</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 rounded-2xl bg-slate-50 border-0 outline-none focus:ring-2 focus:ring-[#0F4C5C] font-semibold"
                >
                  <option value="all">Semua Merek ({uniqueBrands.length})</option>
                  {uniqueBrands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Urutan</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full text-xs px-3.5 py-3 rounded-2xl bg-slate-50 border-0 outline-none focus:ring-2 focus:ring-[#0F4C5C] font-semibold"
                >
                  <option value="latest">Tanggal Tes Terbaru</option>
                  <option value="most_tested">Paling Banyak Dites</option>
                  <option value="trust">Kepercayaan Tertinggi</option>
                </select>
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
              >
                Reset Filter
              </button>

              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="px-6 py-3 rounded-2xl bg-[#0F4C5C] text-white text-xs font-extrabold hover:bg-[#166479] cursor-pointer active:scale-95"
              >
                Terapkan ({filteredProducts.length} Produk)
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
