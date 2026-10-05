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
  Sparkles,
  LogOut,
  Mail,
  Building,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { ProductItem, UserOrder, UserAccount } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { AuthForm } from '../auth/AuthForm';
import { MercuryMascot } from '../illustrations/MercuryMascot';

interface AccountViewProps {
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount, message?: string) => void;
  onLogout: () => void;
  products: ProductItem[];
  userOrders: UserOrder[];
  onNavigateToScan: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentUser,
  onLogin,
  onLogout,
  products,
  userOrders,
  onNavigateToScan,
  onSelectProduct
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'orders' | 'badges'>('tests');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // If user is logged in, find their own test results
  const userTests = currentUser
    ? products.flatMap(p => 
        p.tests
          .filter(t => 
            t.testerName.toLowerCase().includes(currentUser.name.toLowerCase()) || 
            currentUser.name.toLowerCase().includes(t.testerName.toLowerCase())
          )
          .map(t => ({
            ...t,
            productName: p.name,
            productBrand: p.brand,
            parentProduct: p
          }))
      )
    : [];

  // =========================================================================
  // VIEW A: USER IS NOT LOGGED IN (SHOW LOGIN / REGISTER VIEW)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-teal-50 rounded-3xl border border-teal-100 shadow-2xs">
              <MercuryMascot mood="wave" size={54} />
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              Masuk atau Buat Akun
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
              Simpan riwayat hasil tes skincare-mu, pantau pesanan kit uji, dan jadilah kontributor komunitas terpercaya.
            </p>
          </div>

          {/* Value Props Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-left">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <span className="text-base">📋</span>
              <div>
                <p className="text-xs font-bold text-slate-800">Riwayat Tersimpan</p>
                <p className="text-[11px] text-slate-500 font-medium">Bisa dicek kapan saja dari HP.</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <span className="text-base">🔬</span>
              <div>
                <p className="text-xs font-bold text-slate-800">Akurasi Objektif</p>
                <p className="text-[11px] text-slate-500 font-medium">Kalibrasi warna standar.</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <span className="text-base">🎖️</span>
              <div>
                <p className="text-xs font-bold text-slate-800">Lencana Komunitas</p>
                <p className="text-[11px] text-slate-500 font-medium">Apresiasi teman penguji.</p>
              </div>
            </div>
          </div>

          {/* Embedded Auth Form */}
          <div className="pt-6 border-t border-slate-100 text-left">
            <AuthForm
              onSuccess={(user, msg) => {
                onLogin(user, msg);
              }}
              initialMode="login"
            />
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW B: USER IS LOGGED IN (SHOW FULL PROFILE & ACCOUNT DASHBOARD)
  // =========================================================================
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* User Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 relative overflow-hidden">
        
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/50 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left relative z-10">
          {/* Avatar with Initials */}
          <div className="w-18 h-18 rounded-3xl bg-[#0F4C5C] text-white flex items-center justify-center font-black text-2xl shadow-md shadow-[#0F4C5C]/20 border-2 border-white flex-shrink-0">
            {currentUser.initials}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800">{currentUser.name}</h1>
              <span className="text-[11px] font-bold text-[#0F4C5C] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
                Anggota Komunitas
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium justify-center sm:justify-start">
              <span className="font-mono text-slate-600 font-bold">{currentUser.memberId}</span>
              <span>·</span>
              <span>{currentUser.email}</span>
              {currentUser.city && (
                <>
                  <span>·</span>
                  <span>{currentUser.city}</span>
                </>
              )}
            </div>

            {currentUser.bio && (
              <p className="text-xs text-slate-600 font-medium pt-1 max-w-lg">
                "{currentUser.bio}"
              </p>
            )}

            <div className="flex items-center gap-4 pt-2 text-xs text-slate-600 font-medium justify-center sm:justify-start">
              <span><strong>{userTests.length}</strong> Skincare Dites</span>
              <span>·</span>
              <span><strong>{userOrders.length}</strong> Pesanan Kit</span>
              <span>·</span>
              <span>Bergabung sejak <strong>{currentUser.joinDate}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Scan Skincare & Log Out */}
        <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto relative z-10 pt-2 sm:pt-0">
          <button
            onClick={onNavigateToScan}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#E8837A] hover:bg-[#D96F65] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Scan Skincare</span>
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Keluar</span>
          </button>
        </div>

      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs text-amber-900 font-semibold text-center sm:text-left">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <span>Apakah kamu yakin ingin keluar dari akun ini?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={() => {
                setShowLogoutConfirm(false);
                onLogout();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
            >
              Ya, Keluar
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('tests')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'tests'
              ? 'border-[#0F4C5C] text-[#0F4C5C]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Hasil Tes Saya ({userTests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'border-[#0F4C5C] text-[#0F4C5C]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Pesanan Kertas Uji ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
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
              <div className="flex justify-center">
                <MercuryMascot mood="curious" size={48} />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Kamu belum pernah menguji skincare.
              </p>
              <button
                onClick={onNavigateToScan}
                className="px-5 py-2.5 rounded-2xl bg-[#0F4C5C] text-white text-xs font-bold hover:bg-[#166479] cursor-pointer"
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
          {userOrders.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
              <p className="text-xs text-slate-500 font-medium">Belum ada pesanan kertas uji.</p>
            </div>
          ) : (
            userOrders.map((order) => (
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
            ))
          )}
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
              Telah menguji dan membagikan hasil skrining skincare ke komunitas MERCURY.
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
