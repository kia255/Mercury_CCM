import React from 'react';
import { Home, Sparkles, Camera, ShoppingBag, User } from 'lucide-react';

interface MobileBottomBarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentTab,
  onNavigate
}) => {
  // 5 exact tabs specified by user: Beranda, Hasil Tes, Scan (center coral), Toko, Akun
  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'database', label: 'Hasil Tes', icon: Sparkles },
    { id: 'scan', label: 'Scan', icon: Camera, center: true },
    { id: 'toko', label: 'Toko', icon: ShoppingBag },
    { id: 'akun', label: 'Akun', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 shadow-lg pb-[env(safe-area-inset-bottom,10px)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          if (tab.center) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="flex flex-col items-center justify-center -mt-6 focus:outline-none group active:scale-90 transition-transform"
                aria-label="Scan Kertas Uji"
              >
                <div className="w-14 h-14 rounded-full bg-[#E8837A] hover:bg-[#D96F65] text-white flex items-center justify-center shadow-lg shadow-[#E8837A]/35 border-[3px] border-white">
                  <Icon size={24} className="stroke-[2.5]" />
                </div>
                <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-[#0F4C5C]' : 'text-slate-600'}`}>
                  Scan
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl focus:outline-none transition-colors ${
                isActive ? 'text-[#0F4C5C] font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
