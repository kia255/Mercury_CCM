/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { Footer } from './components/common/Footer';

// Views
import { HomeView } from './components/home/HomeView';
import { DatabaseView } from './components/database/DatabaseView';
import { ScanView } from './components/scan/ScanView';
import { ShopView } from './components/shop/ShopView';
import { EducationView } from './components/education/EducationView';
import { AccountView } from './components/account/AccountView';

// Modals
import { ProductDetailModal } from './components/database/ProductDetailModal';
import { ReportDataModal } from './components/modals/ReportDataModal';
import { ManufacturerObjectionModal } from './components/modals/ManufacturerObjectionModal';
import { CartModal } from './components/shop/CartModal';
import { AuthModal } from './components/auth/AuthModal';
import { SplashOnboardingModal } from './components/onboarding/SplashOnboardingModal';
import { ChatbotWidget } from './components/chat/ChatbotWidget';

// Types & Data
import { 
  ProductItem, 
  CartItem, 
  KitPackage, 
  UserOrder, 
  UserReport, 
  ManufacturerObjection,
  UserAccount
} from './types';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import { INITIAL_USERS } from './data/mockUsers';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('beranda');

  // Search Query state (can be populated from Home hero)
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Products Database state (persisted in localStorage)
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('mercury_products');
      if (saved && !saved.includes('unsplash.com')) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Gagal memuat produk dari localStorage:", e);
    }
    return INITIAL_PRODUCTS;
  });

  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mercury_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Gagal memuat keranjang:", e);
    }
    return [{ packageId: 'pkg-5', quantity: 1 }]; // default 1 kit for pleasant initial preview
  });

  // User Orders state
  const [userOrders, setUserOrders] = useState<UserOrder[]>(() => {
    try {
      const saved = localStorage.getItem('mercury_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Gagal memuat pesanan:", e);
    }
    return [
      {
        orderId: 'MRC-ORD-881290',
        date: '2026-09-22',
        items: [{ packageId: 'pkg-5', packageName: 'MERCURY Skincare Routine Pack', quantity: 1, price: 69000 }],
        totalAmount: 81000,
        customerName: 'Aulia Ramadhani',
        phone: '081234567890',
        email: 'aulia@student.ui.ac.id',
        address: 'Jl. Salemba Raya No. 4, Jakarta Pusat',
        city: 'Jakarta Pusat',
        paymentMethod: 'QRIS Instan',
        status: 'selesai',
        trackingNumber: 'JP8829103991'
      }
    ];
  });

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isObjectionOpen, setIsObjectionOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // User Authentication state (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('mercury_current_user');
      if (saved !== null) {
        return saved === 'guest' ? null : JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Gagal memuat pengguna:", e);
    }
    // User is logged out by default unless previously logged in
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Splash Screen & Onboarding State (shown on first app open, or when user clicks logo on Beranda)
  const [isSplashOnboardingOpen, setIsSplashOnboardingOpen] = useState<boolean>(() => {
    try {
      const hasSeen = localStorage.getItem('mercury_has_seen_intro');
      return !hasSeen;
    } catch {
      return false;
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const handleLogin = (user: UserAccount, message?: string) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast(message || `Selamat datang kembali, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast("Kamu telah berhasil keluar (log out).");
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Sync current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('mercury_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.setItem('mercury_current_user', 'guest');
      }
    } catch (e) {
      console.warn("Gagal menyimpan pengguna:", e);
    }
  }, [currentUser]);

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mercury_products', JSON.stringify(products));
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage:", e);
    }
  }, [products]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mercury_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Gagal menyimpan keranjang:", e);
    }
  }, [cartItems]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mercury_orders', JSON.stringify(userOrders));
    } catch (e) {
      console.warn("Gagal menyimpan pesanan:", e);
    }
  }, [userOrders]);

  // Handler: Add or merge new product into database
  const handleProductCreated = (newProduct: ProductItem) => {
    setProducts(prev => {
      // Check if product already exists by exact brand + name
      const existingIndex = prev.findIndex(p => 
        p.name.toLowerCase() === newProduct.name.toLowerCase() &&
        p.brand.toLowerCase() === newProduct.brand.toLowerCase()
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newTests = [...newProduct.tests, ...existing.tests];
        
        updated[existingIndex] = {
          ...existing,
          testerCount: existing.testerCount + 1,
          lastTestedDate: newProduct.lastTestedDate,
          tests: newTests,
          // Elevate trust level if multiple tests agree
          trustLevel: newTests.length >= 3 ? 'tinggi' : 'sedang',
          status: newProduct.status
        };
        return updated;
      } else {
        return [newProduct, ...prev];
      }
    });
  };

  // Cart operations
  const handleAddToCart = (pkg: KitPackage, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.packageId === pkg.id);
      if (existing) {
        return prev.map(item => 
          item.packageId === pkg.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { packageId: pkg.id, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (packageId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.packageId === packageId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (packageId: string) => {
    setCartItems(prev => prev.filter(item => item.packageId !== packageId));
  };

  const handleOrderCompleted = (newOrder: UserOrder) => {
    setUserOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
  };

  // Product Selection handlers
  const handleOpenProductDetail = (product: ProductItem) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B]">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenSplashOnboarding={() => setIsSplashOnboardingOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-fadeIn">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-2.5 text-xs font-semibold">
            <span className="text-emerald-400">✓</span>
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-slate-400 hover:text-white p-0.5"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area with Smooth Motion Transitions */}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentTab === 'beranda' && (
              <HomeView
                products={products}
                onNavigate={(tab) => {
                  setCurrentTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSearchSubmit={(q) => setSearchQuery(q)}
                onSelectProduct={handleOpenProductDetail}
                onOpenSplashOnboarding={() => setIsSplashOnboardingOpen(true)}
              />
            )}

            {currentTab === 'database' && (
              <DatabaseView
                products={products}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSelectProduct={handleOpenProductDetail}
                onNavigateToScan={() => {
                  setCurrentTab('scan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentTab === 'scan' && (
              <ScanView
                onProductCreated={handleProductCreated}
                onNavigateToDatabase={() => {
                  setCurrentTab('database');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                currentUser={currentUser}
              />
            )}

            {currentTab === 'toko' && (
              <ShopView
                onAddToCart={handleAddToCart}
                onNavigateToScan={() => {
                  setCurrentTab('scan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenCart={() => setIsCartOpen(true)}
              />
            )}

            {currentTab === 'edukasi' && (
              <EducationView />
            )}

            {currentTab === 'akun' && (
              <AccountView
                currentUser={currentUser}
                onLogin={handleLogin}
                onLogout={handleLogout}
                products={products}
                userOrders={userOrders}
                onNavigateToScan={() => {
                  setCurrentTab('scan');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectProduct={handleOpenProductDetail}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer with Mandatory Disclaimers */}
      <Footer
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
      />

      {/* Modals */}
      <ProductDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        product={selectedProduct}
        onOpenReport={(prod) => {
          setIsDetailOpen(false);
          setSelectedProduct(prod);
          setIsReportOpen(true);
        }}
        onOpenObjection={(prod) => {
          setIsDetailOpen(false);
          setSelectedProduct(prod);
          setIsObjectionOpen(true);
        }}
        onTestThisProduct={(prod) => {
          setIsDetailOpen(false);
          setCurrentTab('scan');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <ReportDataModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        product={selectedProduct}
        onReportSubmitted={(report) => {
          console.log("Laporan data tersimpan:", report);
        }}
      />

      <ManufacturerObjectionModal
        isOpen={isObjectionOpen}
        onClose={() => setIsObjectionOpen(false)}
        product={selectedProduct}
        onObjectionSubmitted={(objection) => {
          console.log("Sanggahan produsen tersimpan:", objection);
        }}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Authentication Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLogin}
        initialMode={authModalMode}
      />

      {/* Splash Screen & Onboarding 1 Modal (First time launch or clicking Logo in Beranda) */}
      <SplashOnboardingModal
        isOpen={isSplashOnboardingOpen}
        onClose={() => setIsSplashOnboardingOpen(false)}
        onDirectToRegister={() => {
          setIsSplashOnboardingOpen(false);
          handleOpenAuth('register');
        }}
        onDirectToLogin={() => {
          setIsSplashOnboardingOpen(false);
          handleOpenAuth('login');
        }}
      />

      {/* Asisten Chatbot MERCURY (Mercy) */}
      <ChatbotWidget
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenExternal={isChatOpen}
        onCloseExternal={() => setIsChatOpen(false)}
      />

    </div>
  );
}
