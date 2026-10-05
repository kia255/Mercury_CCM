import React, { useState } from 'react';
import { 
  User, 
  FlaskConical, 
  Package, 
  Award, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  PlusCircle,
  Sparkles 
} from 'lucide-react';
import { ProductItem, UserOrder } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface AccountViewProps {
  products: ProductItem[];
  userOrders: UserOrder[];
  onNavigateToScan: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  products,
  userOrders,
  onNavigateToScan,
  onSelectProduct
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'orders' | 'badges'>('tests');

  const userTests = products.flatMap(p => 
    p.tests.map(t => ({
      ...t,
      productName: p.name,
      productBrand: p.brand,
      parentProduct: p
    }))
  ).slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* User Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-3xl bg-[#0F4C5C] text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
            AR
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl font-extrabold text-slate-800">Aulia Ramadhani</h1>
              <span className="text-[11px] font-bold text-[#0F4C5C] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                Kontributor Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              ID: MRC-USR-2026-882
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-slate-600 font-medium justify-center sm:justify-start">
              <span><strong>{userTests.length}</strong> Skincare Dites</span>
              <span>·</span>
              <span><strong>{userOrders.length}</strong> Pesanan Kit</span>
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateToScan}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#E8837A] hover:bg-[#D96F65] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <PlusCircle size={16} />
          <span>Scan Skincare Baru</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('tests')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'tests'
              ? 'border-[#0F4C5C] text-[#0F4C5C]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Hasil Tes Saya ({userTests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'orders'
              ? 'border-[#0F4C5C] text-[#0F4C5C]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Pesanan Kertas Uji ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'badges'
              ? 'border-[#0F4C5C] text-[#0F4C5C]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Lencana</span>
        </button>
      </div>

      {/* TAB 1: HASIL TES SAYA */}
      {activeTab === 'tests' && (
        <div className="space-y-3">
          {userTests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <p className="text-xs text-slate-500">Kamu belum pernah menguji skincare.</p>
              <button
                onClick={onNavigateToScan}
                className="px-5 py-2.5 rounded-2xl bg-[#0F4C5C] text-white text-xs font-bold hover:bg-[#166479]"
              >
                Scan Skincare Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {userTests.map((test) => (
                <div
                  key={test.id}
                  onClick={() => onSelectProduct(test.parentProduct)}
                  className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{test.productBrand}</span>
                      <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1">{test.productName}</h4>
                    </div>
                    <StatusBadge status={test.status} size="sm" />
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                    <div 
                      className="w-6 h-6 rounded-lg border border-slate-300 flex-shrink-0"
                      style={{
                        backgroundColor: `rgb(${test.rgbNormalized.r}, ${test.rgbNormalized.g}, ${test.rgbNormalized.b})`
                      }}
                    />
                    <div className="font-mono text-[11px] text-slate-700">
                      ΔE {test.chromaShift} · {test.estimatedPpmRange}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{test.date}</span>
                    <span className="text-[#0F4C5C] font-bold flex items-center gap-0.5">
                      Lihat Produk <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PESANAN SAYA */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {userOrders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
                <div>
                  <span className="font-bold text-slate-800">No. Pesanan: </span>
                  <span className="font-mono font-bold text-[#0F4C5C]">{order.orderId}</span>
                </div>
                <div className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                  ✓ Sedang Dikirim
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700 font-medium">
                    <span>{item.packageName} x {item.quantity}</span>
                    <span className="font-mono">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="text-slate-500 font-normal">Resi: {order.trackingNumber}</span>
                <span>Total: <strong className="text-[#0F4C5C]">Rp{order.totalAmount.toLocaleString('id-ID')}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LENCANA */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-xl">
              🎖️
            </div>
            <h4 className="font-bold text-sm text-slate-800">Pionir Skincare Cerdas</h4>
            <p className="text-xs text-slate-500 font-medium">
              Telah menguji dan membagikan hasil skrining skincare ke komunitas.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto text-xl">
              🔬
            </div>
            <h4 className="font-bold text-sm text-slate-800">Mata Teliti</h4>
            <p className="text-xs text-slate-500 font-medium">
              Berhasil mengambil foto uji dengan pencahayaan seimbang dan terkalibrasi.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
