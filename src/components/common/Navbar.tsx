import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Camera, 
  ShoppingBag, 
  BookOpen, 
  User, 
  Menu, 
  X, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { BPOM_OFFICIAL_URL } from '../../config/constants';

import { MercuryLogo } from './MercuryLogo';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  cartCount,
  onOpenCart
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Updated tab names: "Database" -> "Hasil Tes"
  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'database', label: 'Hasil Tes' },
    { id: 'scan', label: 'Scan Skincare', highlight: true },
    { id: 'toko', label: 'Toko Kit' },
    { id: 'edukasi', label: 'Edukasi' },
    { id: 'akun', label: 'Akun' }
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand with User's Official Design */}
          <div 
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="group-hover:scale-105 transition-transform duration-200">
              <MercuryLogo variant="full" size={42} />
            </div>
            <div className="hidden lg:block border-l border-slate-200 pl-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-50 text-[#0F4C5C] border border-teal-200/60">
                  Platform Skrining Terbuka
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Cek merkuri skincare dalam hitungan menit
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#E8837A] hover:bg-[#D96F65] shadow-sm shadow-[#E8837A]/30 transition-all transform active:scale-95"
                  >
                    <Camera size={15} />
                    <span>Scan Kertas Uji</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'text-[#0F4C5C] bg-teal-50/70 font-extrabold'
                      : 'text-slate-600 hover:text-[#0F4C5C] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons (Cart & BPOM external link) */}
          <div className="flex items-center gap-2">
            <a
              href={BPOM_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0F4C5C] px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 font-semibold transition-colors"
            >
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Cek BPOM</span>
              <ExternalLink size={12} className="text-slate-400" />
            </a>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-2xl text-slate-600 hover:text-[#0F4C5C] hover:bg-slate-100 transition-colors"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#E8837A] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-xl text-slate-700 hover:bg-slate-100"
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold ${
                  item.highlight
                    ? 'bg-[#E8837A] text-white shadow-sm'
                    : isActive
                    ? 'bg-teal-50 text-[#0F4C5C]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.highlight && <Camera size={18} />}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100">
            <a
              href={BPOM_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
            >
              <span>Buka Portal Cek BPOM Resmi</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
