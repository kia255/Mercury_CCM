import React, { useState } from 'react';
import { X, Building2, CheckCircle2, Shield, Upload } from 'lucide-react';
import { ProductItem, ManufacturerObjection } from '../../types';

interface ManufacturerObjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductItem | null;
  onObjectionSubmitted: (objection: ManufacturerObjection) => void;
}

export const ManufacturerObjectionModal: React.FC<ManufacturerObjectionModalProps> = ({
  isOpen,
  onClose,
  product,
  onObjectionSubmitted
}) => {
  const [companyName, setCompanyName] = useState('');
  const [picName, setPicName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [officialBpomNumber, setOfficialBpomNumber] = useState('');
  const [explanation, setExplanation] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim() || !explanation.trim()) return;

    const objection: ManufacturerObjection = {
      id: `obj-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      companyName,
      picName,
      email,
      phone,
      officialBpomNumber: officialBpomNumber || product.bpomNumber,
      explanation,
      documentName: documentName || 'Sertifikat_Uji_Laboratorium_AAS.pdf',
      status: 'menunggu_peninjauan',
      submittedAt: new Date().toISOString()
    };

    onObjectionSubmitted(objection);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-[#0F4C5C]">
            <Building2 size={20} />
            <h3 className="font-bold text-base text-[#1E293B]">
              Pengajuan Sanggahan Resmi Produsen
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="font-bold text-base text-slate-800">
              Sanggahan Berhasil Dikirimkan
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Data Anda telah masuk ke meja dewan etik dan verifikator independen MERCURY. Kami akan memverifikasi nomor registrasi BPOM dan hasil laboratorium resmi dalam 2x24 jam kerja.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 leading-relaxed flex items-start gap-2">
              <Shield size={16} className="text-sky-700 flex-shrink-0 mt-0.5" />
              <span>
                Formulir ini dikhususkan bagi produsen, pemilik merek, atau pemegang izin edar resmi yang ingin melampirkan sertifikat uji lab terakreditasi untuk mengklarifikasi hasil skrining awal.
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500">Produk Terkait:</span>
              <p className="font-bold text-xs text-slate-800">{product.name} ({product.brand})</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Perusahaan / PT <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="PT Kosmetika Sejahtera"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Penanggung Jawab (PIC) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  placeholder="Nama Lengkap & Jabatan"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Resmi Perusahaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="legal@perusahaan.co.id"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Telepon / WhatsApp Resmi
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Sertifikat Izin Edar BPOM Asli
              </label>
              <input
                type="text"
                value={officialBpomNumber}
                onChange={(e) => setOfficialBpomNumber(e.target.value)}
                placeholder="Contoh: NA18230104821"
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Penjelasan / Klarifikasi Sanggahan <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Jelaskan dasar sanggahan, nomor batch produk resmi, dan hasil uji internal..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none"
              />
            </div>

            {/* Document Upload Simulation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lampiran Dokumen (CoA / Sertifikat Lab AAS / Bukti Izin BPOM)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="doc-upload"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setDocumentName(f.name);
                  }}
                />
                <label
                  htmlFor="doc-upload"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                >
                  <Upload size={14} />
                  <span>Pilih Berkas PDF / JPG</span>
                </label>
                <span className="text-xs text-slate-500 truncate max-w-xs font-mono">
                  {documentName || 'Belum ada berkas terpilih'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#0F4C5C] hover:bg-[#166479] rounded-xl transition-colors shadow-sm"
              >
                Ajukan Sanggahan Resmi
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
