import React from 'react';
import { ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { GLOBAL_DISCLAIMER, BPOM_OFFICIAL_URL, BPOM_DISCLAIMER_TEXT } from '../../config/constants';

import { MercuryLogo } from './MercuryLogo';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 pb-24 md:pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* ONE-LINE COMPACT DISCLAIMER AS REQUESTED */}
        <div className="text-center py-2.5 px-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 font-medium">
          ⚠️ {GLOBAL_DISCLAIMER}
        </div>

        {/* Links & Brand row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs">
          
          <div className="flex items-center gap-3">
            <MercuryLogo variant="full" colorMode="light" size={32} />
            <span className="text-slate-500 border-l border-slate-700 pl-3 hidden sm:inline">Cek Merkuri Skincare Mandiri</span>
          </div>

          <div className="flex items-center gap-5 font-medium text-slate-400">
            <button onClick={() => onNavigate('beranda')} className="hover:text-white transition-colors">
              Beranda
            </button>
            <button onClick={() => onNavigate('database')} className="hover:text-white transition-colors">
              Hasil Tes
            </button>
            <button onClick={() => onNavigate('scan')} className="hover:text-white transition-colors">
              Scan
            </button>
            <button onClick={() => onNavigate('toko')} className="hover:text-white transition-colors">
              Toko Kit
            </button>
            <button onClick={() => onNavigate('edukasi')} className="hover:text-white transition-colors">
              Edukasi
            </button>
            <a
              href={BPOM_OFFICIAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              <span>Portal Cek BPOM</span>
              <ExternalLink size={12} />
            </a>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© 2026 MERCURY. Dibuat untuk masyarakat cerdas dan aman berbelanja skincare.</p>
          <p>{BPOM_DISCLAIMER_TEXT}</p>
        </div>

      </div>
    </footer>
  );
};
