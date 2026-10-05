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

// Types & Data
import { 
  ProductItem, 
  CartItem, 
  KitPackage, 
  UserOrder, 
  UserReport, 
  ManufacturerObjection 
} from './types';
import { INITIAL_PRODUCTS } from './data/mockProducts';
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
  const handleAddToCart = (pkg: KitPackage) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.packageId === pkg.id);
      if (existing) {
        return prev.map(item => 
          item.packageId === pkg.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { packageId: pkg.id, quantity: 1 }];
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
      />

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

    </div>
  );
}
