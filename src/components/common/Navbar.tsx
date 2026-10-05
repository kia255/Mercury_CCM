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
import { UserAccount } from '../../types';
import { MercuryLogo } from './MercuryLogo';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onLogout?: () => void;
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  cartCount,
  onOpenCart,
  currentUser = null,
  onOpenAuth,
  onLogout,
  onOpenChat
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

          {/* Right Action Icons (AI Chat, Cart, Auth, & BPOM external link) */}
          <div className="flex items-center gap-2">
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="hidden lg:inline-flex items-center gap-1.5 text-xs text-[#0F4C5C] hover:bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200/80 font-bold transition-all cursor-pointer"
                title="Tanya Asisten AI Merqi"
              >
                <Sparkles size={14} className="text-[#E8837A]" />
                <span>Asisten AI</span>
              </button>
            )}

            <a
              href={BPOM_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0F4C5C] px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 font-semibold transition-colors"
            >
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Cek BPOM</span>
              <ExternalLink size={12} className="text-slate-400" />
            </a>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-2xl text-slate-600 hover:text-[#0F4C5C] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#E8837A] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Button (Desktop) */}
            <div className="hidden sm:relative sm:block">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full border border-slate-200 hover:border-[#0F4C5C]/30 bg-slate-50/80 hover:bg-white text-xs font-bold text-slate-700 transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center text-[11px] font-extrabold shadow-2xs">
                      {currentUser.initials}
                    </div>
                    <span className="max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scaleUp">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-extrabold text-slate-800 line-clamp-1">{currentUser.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          handleNavClick('akun');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <User size={14} className="text-[#0F4C5C]" />
                        <span>Profil & Riwayat Tes</span>
                      </button>

                      {onLogout && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                        >
                          <X size={14} />
                          <span>Keluar (Log Out)</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenAuth ? onOpenAuth('login') : handleNavClick('akun')}
                    className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-[#0F4C5C] hover:bg-teal-50 transition-colors cursor-pointer"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => onOpenAuth ? onOpenAuth('register') : handleNavClick('akun')}
                    className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#0F4C5C] hover:bg-[#166479] shadow-2xs transition-all cursor-pointer"
                  >
                    Daftar
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Menu navigasi"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fadeIn">
          
          {/* User profile banner or quick login in mobile drawer */}
          <div className="p-3 bg-slate-50 rounded-2xl mb-2 border border-slate-100">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div 
                  onClick={() => handleNavClick('akun')}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center text-xs font-black">
                    {currentUser.initials}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                  </div>
                </div>

                {onLogout && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="text-xs font-bold text-red-600 px-2.5 py-1 rounded-lg border border-red-200 bg-white"
                  >
                    Keluar
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs">
                  <p className="font-extrabold text-slate-800">Punya akun MERCURY?</p>
                  <p className="text-[10px] text-slate-500">Masuk untuk simpan riwayat tes</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('login');
                      else handleNavClick('akun');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-[#0F4C5C]"
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAuth) onOpenAuth('register');
                      else handleNavClick('akun');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#0F4C5C] text-white text-xs font-extrabold"
                  >
                    Daftar
                  </button>
                </div>
              </div>
            )}
          </div>

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
          {onOpenChat && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-teal-50 text-[#0F4C5C] text-xs font-bold border border-teal-200/80 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} className="text-[#E8837A]" />
                <span>Tanya Asisten AI Merqi</span>
              </div>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-extrabold text-[#0F4C5C]">
                Chatbot
              </span>
            </button>
          )}

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
