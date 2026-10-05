import React, { useState } from 'react';
import { X, Flag, CheckCircle2 } from 'lucide-react';
import { ProductItem } from '../../types';

interface ReportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onReportSubmitted: (report: any) => void;
}

export const ReportDataModal: React.FC<ReportDataModalProps> = ({
  isOpen,
  onClose,
  product,
  onReportSubmitted
}) => {
  const [reason, setReason] = useState<string>('data_salah');
  const [notes, setNotes] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReportSubmitted({
      id: `rep-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      reason,
      notes,
      reporterContact,
      createdAt: new Date().toISOString()
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-rose-700">
            <Flag size={18} />
            <h3 className="font-bold text-sm text-[#1E293B]">Laporkan Data Skrining</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h4 className="font-bold text-base text-slate-800">Laporan Diterima</h4>
            <p className="text-xs text-slate-600">
              Terima kasih atas kepedulian Anda menjaga integritas data terbuka MERCURY. Tim kurator akan meninjau laporan ini.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <span className="text-[11px] text-slate-500">Produk yang Dilaporkan:</span>
              <p className="font-bold text-xs text-slate-800">{product.name} ({product.brand})</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alasan Pelaporan
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none bg-white"
              >
                <option value="data_salah">Informasi produk salah / tidak cocok</option>
                <option value="foto_tidak_sesuai">Foto kertas uji buram atau tidak sesuai</option>
                <option value="indikasi_spam">Laporan terindikasi spam / manipulasi</option>
                <option value="merek_keliru">Merek atau nomor BPOM keliru</option>
                <option value="lainnya">Alasan lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Penjelasan Tambahan <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Berikan detail ketidaksesuaian data yang Anda temukan..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Kontak Pelapor (Opsional, untuk tindak lanjut)
              </label>
              <input
                type="text"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                placeholder="email@anda.com"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm"
              >
                Kirim Laporan
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
