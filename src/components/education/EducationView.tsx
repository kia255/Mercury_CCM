import React from 'react';
import { 
  AlertTriangle, 
  ExternalLink, 
  PhoneCall, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { BPOM_OFFICIAL_URL, GLOBAL_DISCLAIMER } from '../../config/constants';

export const EducationView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Kenapa Merkuri Sangat Berbahaya?
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Yuk pahami efek samping raksa pada kulit dan tubuh kita.
        </p>
      </div>

      {/* 1. APA ITU MERKURI */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Fakta Medis</span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Mengapa Ada Merkuri di Krim Pemutih Ilegal?
          </h2>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Merkuri (Hg) secara paksa menghentikan pembentukan pigmen kulit (melanin). Hasilnya, kulit memang terlihat putih instan dalam beberapa hari. Tapi setelah itu, lapisan pelindung kulit rusak total dan racun logamnya diserap ke dalam organ dalam tubuh.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
            <h4 className="font-bold text-xs text-rose-800">1. Flek Hitam Kebiruan Permanen</h4>
            <p className="text-xs text-rose-700 font-medium">
              Begitu krim dihentikan, kulit akan timbul flek hitam pekat (okronosis) yang sangat sulit dihilangkan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
            <h4 className="font-bold text-xs text-rose-800">2. Kerusakan Ginjal</h4>
            <p className="text-xs text-rose-700 font-medium">
              Merkuri meresap lewat pori-pori dan menumpuk di ginjal, memicu gagal ginjal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
            <h4 className="font-bold text-xs text-rose-800">3. Gangguan Saraf & Otak</h4>
            <p className="text-xs text-rose-700 font-medium">
              Dapat memicu tangan gemetar (tremor), insomnia, pusing menahun, dan mudah cemas.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-1">
            <h4 className="font-bold text-xs text-rose-800">4. Fatal Bagi Janin</h4>
            <p className="text-xs text-rose-700 font-medium">
              Sangat berbahaya jika dipakai ibu hamil karena dapat menyebabkan cacat saraf bawaan pada bayi.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CARA KERJA KERTAS UJI */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800">
          Bagaimana Kertas Uji Mengetahuinya?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Kertas uji dilapisi reagen khusus yang akan bereaksi jika menyentuh ion merkuri.
        </p>
        <div className="p-4 bg-[#F0FDF9] rounded-2xl border border-teal-100 text-xs text-slate-700 font-medium space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span><strong>Jika Aman:</strong> Kertas tetap berwarna kuning muda atau krem asli.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span><strong>Jika Ada Merkuri:</strong> Kertas berubah menjadi merah salmon atau jingga kemerahan.</span>
          </div>
        </div>
      </section>

      {/* 3. TINDAKAN JIKA HASIL TERINDIKASI */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/90 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Harus Bagaimana?</span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Jika Hasil Tes Skincare-mu Terindikasi Merkuri
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
          <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-amber-200/60">
            <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
            <div>
              <strong className="text-slate-800">Hentikan Pemakaian Segera:</strong> Jangan dipakai lagi di wajah atau tubuh.
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-amber-200/60">
            <span className="w-6 h-6 rounded-full bg-[#0F4C5C]/10 text-[#0F4C5C] flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
            <div>
              <strong className="text-slate-800">Simpan Sisa Produk:</strong> Taruh di wadah tertutup sebagai bukti jika ingin konfirmasi ke laboratorium.
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-amber-200/60">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
            <div>
              <strong className="text-slate-800">Laporkan ke BPOM:</strong> Hubungi Halo BPOM di <strong>1500533</strong> agar toko/penjualnya bisa ditindaklanjuti.
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <PhoneCall size={16} className="text-[#0F4C5C]" />
            <span>Halo BPOM: <strong>1500533</strong></span>
          </div>

          <a
            href={BPOM_OFFICIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#0F4C5C] text-white font-bold hover:bg-[#166479] transition-colors"
          >
            <span>Buka Cek BPOM Resmi</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </section>

      {/* One-Line Disclaimer */}
      <div className="py-2.5 px-4 bg-slate-100 rounded-2xl text-center text-xs text-slate-500 font-medium">
        ⚠️ {GLOBAL_DISCLAIMER}
      </div>

    </div>
  );
};
