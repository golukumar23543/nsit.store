import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Product, CartItem, Category } from './types';
import { PRODUCTS as INITIAL_PRODUCTS, STORE_CONTACT } from './constants';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import ChatBot from './components/ChatBot';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';
import Hero from './components/Hero';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  
  // Products as state to allow dynamic updates
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('nsip_inventory');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nsip_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Triple-click tracking for Admin Access
  const logoClickTimer = useRef<number | null>(null);
  const logoClickCount = useRef(0);

  useEffect(() => {
    localStorage.setItem('nsip_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nsip_inventory', JSON.stringify(products));
  }, [products]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        showToast(`${product.name} quantity increased!`);
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      showToast(`${product.name} added to cart!`);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, [showToast]);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast('Item removed from cart');
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast('Cart cleared');
  }, [showToast]);

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [product, ...prev]);
    showToast('Asset deployed to inventory');
  }, [showToast]);

  const removeProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Asset removed from inventory');
  }, [showToast]);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showToast('Asset data recalibrated');
  }, [showToast]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.cat === activeCategory);
  }, [activeCategory, products]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Triple click handler for the logo
  const handleLogoClick = useCallback(() => {
    logoClickCount.current += 1;
    
    if (logoClickTimer.current) {
      window.clearTimeout(logoClickTimer.current);
    }

    if (logoClickCount.current === 3) {
      setIsPasswordPromptOpen(true);
      logoClickCount.current = 0;
    } else {
      logoClickTimer.current = window.setTimeout(() => {
        logoClickCount.current = 0;
      }, 500); // 500ms window to complete the 3 clicks
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === '#golu@91020') {
      setIsAdminOpen(true);
      setIsPasswordPromptOpen(false);
      setAdminPassword('');
      setPasswordError(false);
      showToast('Admin Access Granted');
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050b16] font-['Inter'] selection:bg-brand-terracotta/20 relative">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-navy/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-terracotta/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Header 
        cartCount={cartCount} 
        onCartToggle={() => setIsCartOpen(true)} 
        onLogoClick={handleLogoClick}
      />

      <Hero />

      <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="text-brand-terracotta font-black text-xs uppercase tracking-[0.4em] mb-4">Marketplace</div>
          <h2 className="text-white text-3xl md:text-5xl font-black mb-10">Inventory</h2>
          <CategoryBar 
            active={activeCategory} 
            onChange={setActiveCategory} 
          />
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 mb-16 md:mb-32">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={() => addToCart(product)} 
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 font-bold uppercase tracking-widest opacity-40">
              No assets found in this category
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl rounded-[32px] md:rounded-[40px] p-6 md:p-12 border border-slate-800/50">
            <h2 className="text-2xl md:text-4xl font-black text-white mb-6">About NSIP</h2>
            <div className="space-y-4 text-slate-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
              <p>
                NSIP Store is a elite digital procurement hub specializing in authentic software licenses, lifestyle products, and high-end studio gear.
              </p>
              <p>
                We focus on "Zero Waiting" delivery, ensuring your digital assets are delivered immediately upon confirmation.
              </p>
            </div>

            <div className="bg-slate-800/30 rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-white/5">
              <h3 className="text-white font-bold text-lg md:text-xl mb-6">Secure Channels</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                <li className="flex items-center gap-4 group">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-terracotta transition-all group-hover:bg-brand-terracotta group-hover:text-white">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Terminal</span>
                    <a href={`tel:${STORE_CONTACT.phone}`} className="text-white font-bold hover:text-brand-terracotta transition-colors truncate block">{STORE_CONTACT.phone}</a>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-terracotta transition-all group-hover:bg-brand-terracotta group-hover:text-white">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider block">Payments</span>
                    <span className="text-white font-bold truncate block">{STORE_CONTACT.upi}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-800/50 flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-8 text-center">Global Connections</h2>
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-4 p-5 rounded-[20px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand-terracotta/50 transition-all group">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg">
                  <i className="fab fa-instagram"></i>
                </div>
                <span className="text-slate-300 text-sm font-bold group-hover:text-white transition-colors truncate">{STORE_CONTACT.instagram}</span>
              </a>
              <a href="#" className="flex items-center gap-4 p-5 rounded-[20px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand-terracotta/50 transition-all group">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#0088cc] flex items-center justify-center text-white text-2xl shadow-lg">
                  <i className="fab fa-telegram-plane"></i>
                </div>
                <span className="text-slate-300 text-sm font-bold group-hover:text-white transition-colors truncate">{STORE_CONTACT.telegram}</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-950/80 backdrop-blur-md text-slate-400 py-20 border-t border-slate-900">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-2xl flex items-center justify-center font-black text-xl">NS</div>
                <span className="text-white font-black text-3xl tracking-tighter">NSIP Store</span>
              </div>
              <p className="max-w-xs text-xs font-medium leading-relaxed opacity-60">
                Premium digital asset provisioner. Trusted by professionals since 2018.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div>
                <h4 className="text-white font-bold text-sm mb-4">Navigation</h4>
                <ul className="space-y-2 text-xs font-bold uppercase tracking-widest">
                  <li><a href="#" className="hover:text-brand-terracotta">Catalog</a></li>
                  <li><a href="#" className="hover:text-brand-terracotta">VIP Access</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-4">Support</h4>
                <ul className="space-y-2 text-xs font-bold uppercase tracking-widest">
                  <li><a href="#" className="hover:text-brand-terracotta">Terminal</a></li>
                  <li><a href="#" className="hover:text-brand-terracotta">Verify</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em]">
            <p>© {new Date().getFullYear()} NSIP Store. | VERIFIED PREMIUM VENDOR</p>
            <div className="flex gap-6 items-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
               <span className="flex items-center gap-2"><i className="fas fa-shield-halved text-emerald-400"></i> SECURE</span>
               <span className="flex items-center gap-2"><i className="fas fa-circle-check text-emerald-400"></i> AUTHENTIC</span>
            </div>
          </div>
        </div>
      </footer>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cart}
        total={cartTotal}
        onRemove={removeFromCart}
        onClear={clearCart}
      />

      <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      
      {isAdminOpen && (
        <AdminDashboard 
          products={products}
          onAddProduct={addProduct}
          onRemoveProduct={removeProduct}
          onUpdateProduct={updateProduct}
          onClose={() => setIsAdminOpen(false)} 
        />
      )}
      
      {isPasswordPromptOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsPasswordPromptOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-slate-900 rounded-[32px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-10 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-navy to-brand-terracotta text-white rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl">
              <i className="fas fa-fingerprint text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black text-center text-white mb-2">Access Control</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest text-center mb-10">Restricted Terminal Area</p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <input 
                  autoFocus
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Terminal Key"
                  className={`w-full bg-slate-800/50 border ${passwordError ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white/10'} rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-brand-terracotta/20 transition-all text-center font-mono text-white tracking-[0.5em]`}
                />
                {passwordError && <p className="text-red-500 text-[10px] font-black uppercase mt-4 text-center tracking-[0.2em] animate-pulse">Authentication Failed</p>}
              </div>
              <div className="flex gap-4">
                <button 
                  type="submit"
                  className="w-full py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-brand-terracotta hover:text-white transition-all text-sm uppercase tracking-widest shadow-xl shadow-brand-terracotta/10"
                >
                  Confirm Identity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
};

export default App;