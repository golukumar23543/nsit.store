
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

  // Triple click detection for Admin
  const [clickCount, setClickCount] = useState(0);
  const handleLogoClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount + 1 >= 3) {
      setIsAdminOpen(true);
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Inter']">
      <Header 
        cartCount={cartCount} 
        onCartToggle={() => setIsCartOpen(true)} 
        onLogoClick={handleLogoClick}
      />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CategoryBar 
          active={activeCategory} 
          onChange={setActiveCategory} 
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={() => addToCart(product)} 
            />
          ))}
        </div>

        {/* Professional About & Social Section (Matching Provided Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* About Section */}
          <div className="lg:col-span-2 bg-[#0c1729] rounded-[32px] p-8 md:p-12 shadow-2xl border border-slate-800">
            <h2 className="text-3xl font-bold text-white mb-6">About NSIP Store</h2>
            <div className="space-y-4 text-slate-400 text-lg leading-relaxed mb-10">
              <p>
                NSIP Store is a premium retail platform specializing in authentic clothing, lifestyle products, and high-end electronics. With years of industry expertise, we've built a reputation for reliability, transparency, and exceptional customer service.
              </p>
              <p>
                Our mission is to make premium lifestyle tools and products accessible to everyone. We work directly with global suppliers to offer genuine products at competitive prices, ensuring you get the best value for your money.
              </p>
              <p>
                From everyday fashion to advanced electronics and enterprise collections, we cater to all your lifestyle needs. Our support team is available 24/7 to assist with orders, shipping, and any queries you may have.
              </p>
            </div>

            {/* Contact Information Box */}
            <div className="bg-[#16213a] rounded-[24px] p-8 border border-slate-700/50">
              <h3 className="text-white font-bold text-xl mb-6">Contact Information</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-terracotta transition-colors group-hover:bg-brand-terracotta group-hover:text-white">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <span className="text-slate-500 text-sm block">Primary:</span>
                    <a href={`tel:${STORE_CONTACT.phone}`} className="text-white font-bold hover:text-brand-terracotta transition-colors">{STORE_CONTACT.phone}</a>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-terracotta transition-colors group-hover:bg-brand-terracotta group-hover:text-white">
                    <i className="fas fa-headset"></i>
                  </div>
                  <div>
                    <span className="text-slate-500 text-sm block">Support:</span>
                    <a href={`tel:${STORE_CONTACT.support}`} className="text-white font-bold hover:text-brand-terracotta transition-colors">{STORE_CONTACT.support}</a>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-terracotta transition-colors group-hover:bg-brand-terracotta group-hover:text-white">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <div>
                    <span className="text-slate-500 text-sm block">UPI:</span>
                    <span className="text-white font-bold">{STORE_CONTACT.upi}</span>
                  </div>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-brand-terracotta transition-colors group-hover:bg-brand-terracotta group-hover:text-white">
                    <i className="fas fa-coins"></i>
                  </div>
                  <div>
                    <span className="text-slate-500 text-sm block">Binance ID:</span>
                    <span className="text-white font-bold">{STORE_CONTACT.binanceId}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Connect With Us Sidebar */}
          <div className="bg-[#0c1729] rounded-[32px] p-8 md:p-10 shadow-2xl border border-slate-800 flex flex-col h-full">
            <h2 className="text-2xl font-bold text-white mb-8">Connect With Us</h2>
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-[#16213a] border border-slate-700/50 hover:bg-[#1f2b4a] hover:border-brand-terracotta transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
                  <i className="fab fa-instagram"></i>
                </div>
                <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">{STORE_CONTACT.instagram}</span>
              </a>
              <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-[#16213a] border border-slate-700/50 hover:bg-[#1f2b4a] hover:border-brand-terracotta transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#0088cc] flex items-center justify-center text-white text-xl">
                  <i className="fab fa-telegram-plane"></i>
                </div>
                <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">{STORE_CONTACT.telegram}</span>
              </a>
              <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-[#16213a] border border-slate-700/50 hover:bg-[#1f2b4a] hover:border-brand-terracotta transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#1da1f2] flex items-center justify-center text-white text-xl">
                  <i className="fab fa-twitter"></i>
                </div>
                <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">{STORE_CONTACT.twitter}</span>
              </a>
              <a href={`https://wa.me/${STORE_CONTACT.whatsapp}`} target="_blank" className="flex items-center gap-4 p-4 rounded-2xl bg-[#16213a] border border-slate-700/50 hover:bg-[#1f2b4a] hover:border-brand-terracotta transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#25d366] flex items-center justify-center text-white text-xl">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">WhatsApp: {STORE_CONTACT.phone}</span>
              </a>
              <a href={`https://wa.me/${STORE_CONTACT.whatsappSupport}`} target="_blank" className="flex items-center gap-4 p-4 rounded-2xl bg-[#16213a] border border-slate-700/50 hover:bg-[#1f2b4a] hover:border-brand-terracotta transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#25d366] flex items-center justify-center text-white text-xl">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <span className="text-slate-300 font-semibold group-hover:text-white transition-colors">WhatsApp: {STORE_CONTACT.support}</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Professional Extended Footer */}
      <footer className="bg-[#0c1729] text-slate-400 pt-16 pb-8 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-navy to-brand-terracotta text-white rounded-xl flex items-center justify-center font-bold">NS</div>
                <span className="text-white font-black text-2xl tracking-tighter">NSIP Store</span>
              </div>
              <p className="text-sm leading-relaxed">
                Your trusted partner for premium products, electronics, and digital tools. Quality assurance with authentic services since 2018.
              </p>
              <div className="flex gap-3">
                <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-400">24/7 Support</span>
                <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-400">Instant Activation</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="hover:text-brand-terracotta transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-brand-terracotta transition-colors">Payment Methods</a></li>
                <li><a href="#" className="hover:text-brand-terracotta transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-brand-terracotta transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-white font-bold text-lg mb-6">Contact Info</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex items-center gap-3">
                  <i className="fas fa-phone-alt text-brand-terracotta"></i>
                  <span>Primary: <a href={`tel:${STORE_CONTACT.phone}`} className="text-slate-300 hover:text-white">{STORE_CONTACT.phone}</a></span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-headset text-brand-terracotta"></i>
                  <span>Support: <a href={`tel:${STORE_CONTACT.support}`} className="text-slate-300 hover:text-white">{STORE_CONTACT.support}</a></span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-wallet text-brand-terracotta"></i>
                  <span>UPI: <span className="text-slate-300">{STORE_CONTACT.upi}</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fas fa-coins text-brand-terracotta"></i>
                  <span>Binance ID: <span className="text-slate-300">{STORE_CONTACT.binanceId}</span></span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-widest">
            <p>© {new Date().getFullYear()} NSIP Store. All rights reserved. | Premium Retail Provider</p>
            <div className="flex gap-6 items-center">
              <span className="flex items-center gap-2"><i className="fas fa-shield-alt text-emerald-500"></i> Secure Payments</span>
              <span className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-500"></i> Trusted Seller</span>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-6">
            Contact: {STORE_CONTACT.phone} | {STORE_CONTACT.support}
          </p>
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
      
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
};

export default App;
