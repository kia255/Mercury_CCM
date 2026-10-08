import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Truck, 
  Plus, 
  Minus 
} from 'lucide-react';
import { CartItem, KitPackage, UserOrder } from '../../types';
import { TEST_KIT_PACKAGES } from '../../data/mockShop';
import { KitIllustration } from '../illustrations/KitIllustrations';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (packageId: string, delta: number) => void;
  onRemoveItem: (packageId: string) => void;
  onOrderCompleted: (order: UserOrder) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onOrderCompleted
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  
  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Jakarta Selatan');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [completedOrder, setCompletedOrder] = useState<UserOrder | null>(null);

  if (!isOpen) return null;

  // Calculate cart details
  const populatedCart = cartItems.map(item => {
    const pkg = TEST_KIT_PACKAGES.find(p => p.id === item.packageId);
    return {
      ...item,
      package: pkg
    };
  }).filter(item => item.package !== undefined) as { packageId: string; quantity: number; package: KitPackage }[];

  const subtotal = populatedCart.reduce((sum, item) => sum + (item.package.price * item.quantity), 0);
  const shippingCost = subtotal > 0 ? 12000 : 0;
  const total = subtotal + shippingCost;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) return;

    const newOrder: UserOrder = {
      orderId: `MRC-ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      items: populatedCart.map(item => ({
        packageId: item.packageId,
        packageName: item.package.name,
        quantity: item.quantity,
        price: item.package.price
      })),
      totalAmount: total,
      customerName,
      phone,
      email: email || 'customer@mercury.org',
      address,
      city,
      paymentMethod: paymentMethod === 'qris' ? 'QRIS Instan' : paymentMethod === 'transfer' ? 'Transfer Bank Virtual Account' : 'E-Wallet (GoPay/OVO/ShopeePay)',
      status: 'diproses',
      trackingNumber: `JP${Math.floor(1000000000 + Math.random() * 9000000000)}`
    };

    setCompletedOrder(newOrder);
    onOrderCompleted(newOrder);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#0F4C5C]" />
            <h3 className="font-bold text-base text-[#1E293B]">
              {step === 'cart' && 'Keranjang Belanja Hg Test Kit'}
              {step === 'checkout' && 'Formulir Pemesanan & Pengiriman (Simulasi)'}
              {step === 'success' && 'Pesanan Berhasil Dibuat (Simulasi)'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* =============================================================== */}
        {/* 1. CART VIEW */}
        {/* =============================================================== */}
        {step === 'cart' && (
          <div className="p-6 space-y-5">
            {populatedCart.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <ShoppingBag size={36} className="text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">Keranjang belanja Anda masih kosong.</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold bg-[#0F4C5C] text-white rounded-xl hover:bg-[#166479]"
                >
                  Lihat Hg Test Kit
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {populatedCart.map((item) => (
                    <div key={item.packageId} className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                          <KitIllustration packageId={item.packageId} className="w-full h-full" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800">{item.package.name}</h4>
                          <div className="text-[11px] text-slate-500 font-medium">
                            Rp 49.000 · Isi 5 strip
                          </div>
                          <div className="text-[10px] font-mono text-[#0F4C5C]">
                            Batch: {item.package.batchCode}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Qty controls */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.packageId, -1)}
                            className="p-1 text-slate-500 hover:text-slate-800"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold px-2 text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.packageId, 1)}
                            className="p-1 text-slate-500 hover:text-slate-800"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.packageId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal summary */}
                <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal Produk:</span>
                    <span className="font-semibold text-slate-800">Rp{subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimasi Ongkir (Ekspedisi Kilat):</span>
                    <span className="font-semibold text-slate-800">Rp{shippingCost.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Pembayaran:</span>
                    <span className="text-[#0F4C5C]">Rp{total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Simulated Prototype Warning */}
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center justify-between">
                  <span>Simulasi prototipe — tidak ada pemotongan saldo uang nyata.</span>
                </div>

                <div className="flex justify-between gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Lanjut Belanja
                  </button>
                  <button
                    onClick={() => setStep('checkout')}
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#0F4C5C] text-white text-xs font-bold hover:bg-[#166479] transition-colors"
                  >
                    <span>Lanjut ke Pengiriman</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* =============================================================== */}
        {/* 2. CHECKOUT VIEW */}
        {/* =============================================================== */}
        {step === 'checkout' && (
          <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Data Penerima</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Aulia Ramadhani"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Alamat Lengkap Pengiriman *</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Salemba Raya No. 4, RT 01/RW 02, Kec. Senen, Jakarta Pusat"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-[#0F4C5C] outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Metode Pembayaran (Simulasi)</h4>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${paymentMethod === 'qris' ? 'border-[#0F4C5C] bg-[#0F4C5C]/5 font-bold text-[#0F4C5C]' : 'border-slate-200 text-slate-600'}`}
                >
                  <QrCode size={18} className="mx-auto mb-1" />
                  <span>QRIS Instan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${paymentMethod === 'transfer' ? 'border-[#0F4C5C] bg-[#0F4C5C]/5 font-bold text-[#0F4C5C]' : 'border-slate-200 text-slate-600'}`}
                >
                  <CreditCard size={18} className="mx-auto mb-1" />
                  <span>Virtual Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ewallet')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${paymentMethod === 'ewallet' ? 'border-[#0F4C5C] bg-[#0F4C5C]/5 font-bold text-[#0F4C5C]' : 'border-slate-200 text-slate-600'}`}
                >
                  <Truck size={18} className="mx-auto mb-1" />
                  <span>E-Wallet</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Total Biaya:</span>
                <span className="text-[#0F4C5C]">Rp{total.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-[10px] text-slate-500">Termasuk ongkos kirim proteksi bahan kimia kering.</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0F4C5C] text-white text-xs font-bold hover:bg-[#166479] transition-colors shadow-sm"
              >
                Konfirmasi Pembayaran (Simulasi)
              </button>
            </div>

          </form>
        )}

        {/* =============================================================== */}
        {/* 3. ORDER SUCCESS VIEW */}
        {/* =============================================================== */}
        {step === 'success' && completedOrder && (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-800">Pesanan Berhasil Diproses!</h4>
              <p className="text-xs text-slate-500">
                Nomor Pesanan: <span className="font-mono font-bold text-slate-800">{completedOrder.orderId}</span>
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Penerima:</span>
                <span className="font-semibold text-slate-800">{completedOrder.customerName} ({completedOrder.phone})</span>
              </div>
              <div className="flex justify-between">
                <span>Alamat:</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-xs">{completedOrder.address}</span>
              </div>
              <div className="flex justify-between">
                <span>Metode Pembayaran:</span>
                <span className="font-semibold text-slate-800">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Resi Ekspedisi (Simulasi):</span>
                <span className="font-mono font-bold text-[#0F4C5C]">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total:</span>
                <span className="text-[#0F4C5C]">Rp{completedOrder.totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 leading-relaxed text-left">
              <span className="font-bold">Tips Penggunaan:</span> Setelah kit sampai, simpan kertas uji di tempat sejuk dan terhindar dari sinar matahari langsung. Buka fitur Scan di MERCURY saat Anda siap menguji skincare favorit Anda.
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#0F4C5C] text-white text-xs font-bold hover:bg-[#166479]"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
