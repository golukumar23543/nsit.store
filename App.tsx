import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, CartItem, Category } from './types';
import { PRODUCTS, STORE_CONTACT } from './constants';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import ChatBot from './components/ChatBot';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
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

  useEffect(() => {
    localStorage.setItem('nsip_cart', JSON.stringify(cart));
  }, [cart]);

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

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.cat === activeCategory);
  }, [activeCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const [clickCount, setClickCount] = useState(0);
  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 >= 3) {
      setIsPasswordPromptOpen(true);
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 1000);
  };

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
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Inter'] selection:bg-brand-terracotta/20">
      <Header 
        cartCount={cartCount} 
        onCartToggle={() => setIsCartOpen(true)} 
        onLogoClick={handleLogoClick}
      />

      <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <CategoryBar 
          active={activeCategory} 
          onChange={setActiveCategory} 
        />

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 mb-16 md:mb-20">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={() => addToCart(product)} 
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          <div className="lg:col-span-2 bg-[#0c1729] rounded-[24px] md:rounded-[32px] p-6 md:p-12 shadow-2xl border border-slate-800">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">About NSIP Store</h2>
            <div className="space-y-4 text-slate-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-10">
              <p>
                NSIP Store is a premium retail platform specializing in authentic clothing, lifestyle products, and high-end electronics. With years of industry expertise, we've built a reputation for reliability, transparency, and exceptional customer service.
              </p>
              <p>
                Our mission is to make premium lifestyle tools and products accessible to everyone. We work directly with global suppliers to offer genuine products at competitive prices.
              </p>
            </div>

            <div className="bg-[#16213a] rounded-[20px] md:rounded-[24px] p-6 md:p-8 border border-slate-700/50">
              <h3 className="text-white font-bold text-lg md:text-xl mb-6">Contact Information</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-brand-terracotta transition-colors group-hover:bg-brand-terracotta group-hover:text-white">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-slate-500 text-xs block">Primary:</span>
                    <a href={`tel:${STORE_CONTACT.phone}`} className="text-white font-bold hover:text-brand-terracotta transition-colors truncate block">{STORE_CONTACT.phone}</a>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-brand-terracotta transition-colors group-hover:bg-brand-terracotta group-hover:text-white">
                    <i className="fas fa-headset"></i>
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-slate-500 text-xs block">Support:</span>
                    <a href={`tel:${STORE_CONTACT.support}`} className="text-white font-bold hover:text-brand-terracotta transition-colors truncate block">{STORE_CONTACT.support}</a>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-brand-terracotta transition-colors group-hover:bg-brand-terracotta group-hover:text-white">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-slate-500 text-xs block">UPI:</span>
                    <span className="text-white font-bold truncate block">{STORE_CONTACT.upi}</span>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-brand-terracotta transition-colors group-hover:bg-brand-terracotta group-hover:text-white">
                    <i className="fas fa-coins"></i>
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-slate-500 text-xs block">Binance ID:</span>
                    <span className="text-white font-bold truncate block">{STORE_CONTACT.binanceId}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-[#0c1729] rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-2xl border border-slate-800 flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center lg:text-left">Connect With Us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <a href="#" className="flex items-center gap-4 p-4 rounded-xl md:rounded-2xl bg-[#16213a] border border-slate-700/50 hover:bg-[#1f2b4a] hover:border-brand-terracotta transition-all group">
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
                  <i className="fab fa-instagram"></i>
                </div>
                <span className="text-slate-300 text-sm md:text-base font-semibold group-hover:text-white transition-colors truncate">{STORE_CONTACT.instagram}</span>
              </a>
              <a href="#" className="flex items-center gap-4 p-4 rounded-xl md:rounded-2xl bg-[#16213a] border border-slate-700/50 hover:bg-[#1f2b4a] hover:border-brand-terracotta transition-all group">
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl bg-[#0088cc] flex items-center justify-center text-white text-xl">
                  <i className="fab fa-telegram-plane"></i>
                </div>
                <span className="text-slate-300 text-sm md:text-base font-semibold group-hover:text-white transition-colors truncate">{STORE_CONTACT.telegram}</span>
              </a>
              <a href={`https://wa.me/${STORE_CONTACT.whatsapp}`} target="_blank" className="flex items-center gap-4 p-4 rounded-xl md:rounded-2xl bg-[#16213a] border border-slate-700/50 hover:bg-[#1f2b4a] hover:border-brand-terracotta transition-all group sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl bg-[#25d366] flex items-center justify-center text-white text-xl">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <span className="text-slate-300 text-sm md:text-base font-semibold group-hover:text-white transition-colors truncate">WhatsApp Shop</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#0c1729] text-slate-400 pt-12 md:pt-16 pb-8 border-t border-slate-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-navy to-brand-terracotta text-white rounded-xl flex items-center justify-center font-bold">NS</div>
                <span className="text-white font-black text-xl md:text-2xl tracking-tighter">NSIP Store</span>
              </div>
              <p className="text-xs md:text-sm leading-relaxed">
                Your trusted partner for premium products, electronics, and digital tools. Quality assurance with authentic services since 2018.
              </p>
            </div>

            <div className="hidden sm:block">
              <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="hover:text-brand-terracotta transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-brand-terracotta transition-colors">Payment Methods</a></li>
                <li><a href="#" className="hover:text-brand-terracotta transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-brand-terracotta transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div className="sm:col-span-2 lg:col-span-2">
              <h4 className="text-white font-bold text-lg mb-6">Contact Info</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm font-medium">
                <li className="flex items-center gap-3">
                  <i className="fas fa-phone-alt text-brand-terracotta w-4"></i>
                  <span><a href={`tel:${STORE_CONTACT.phone}`} className="text-slate-300 hover:text-white truncate">{STORE_CONTACT.phone}</a></span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-headset text-brand-terracotta w-4"></i>
                  <span><a href={`tel:${STORE_CONTACT.support}`} className="text-slate-300 hover:text-white truncate">{STORE_CONTACT.support}</a></span>
                </li>
                <li className="flex items-center gap-3 sm:col-span-2">
                  <i className="fas fa-wallet text-brand-terracotta w-4"></i>
                  <span className="truncate">UPI: {STORE_CONTACT.upi}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-center">
            <p>© {new Date().getFullYear()} NSIP Store. | Premium Retail Provider</p>
            <div className="flex gap-4 md:gap-6 items-center">
              <span className="flex items-center gap-2"><i className="fas fa-shield-alt text-emerald-500"></i> Secure Payments</span>
              <span className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-500"></i> Trusted Seller</span>
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
      
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
      
      {/* Admin Password Prompt Modal */}
      {isPasswordPromptOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md" onClick={() => setIsPasswordPromptOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-white rounded-[24px] shadow-2xl p-8 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-brand-navy text-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg">
              <i className="fas fa-lock text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-center text-brand-navy mb-2">Admin Authentication</h3>
            <p className="text-slate-500 text-sm text-center mb-8">Enter the secret key to access the terminal.</p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input 
                  autoFocus
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full bg-slate-50 border ${passwordError ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'} rounded-xl px-5 py-3 outline-none focus:ring-4 focus:ring-brand-navy/5 transition-all text-center font-mono`}
                />
                {passwordError && <p className="text-red-500 text-[10px] font-bold uppercase mt-2 text-center tracking-widest animate-pulse">Access Denied</p>}
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsPasswordPromptOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-brand-navy text-white font-bold rounded-xl hover:bg-brand-navyLight transition-all text-sm shadow-lg shadow-brand-navy/20"
                >
                  Verify Access
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