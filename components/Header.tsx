
import React from 'react';
import { STORE_CONTACT } from '../constants';

interface HeaderProps {
  cartCount: number;
  onCartToggle: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartToggle, onLogoClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={onLogoClick}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-brand-navy to-brand-terracotta text-white rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl shadow-lg group-hover:scale-105 transition-transform">
              NS
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-navy to-brand-terracotta leading-tight">NSIP</h1>
              <p className="text-[10px] md:text-xs text-slate-600 uppercase tracking-wider font-medium">Clothing · Electronics · Books</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <a 
              href={`tel:${STORE_CONTACT.phone}`} 
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-brand-navy font-semibold text-sm hover:bg-slate-200 transition-colors"
            >
              <i className="fas fa-phone-alt"></i> {STORE_CONTACT.phone}
            </a>
            <a 
              href={`https://wa.me/${STORE_CONTACT.whatsapp}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-[#e8f5e9] text-[#1b5e3f] border border-[#a5d6a7] font-semibold text-sm hover:bg-[#c8e6c9] transition-colors shadow-sm"
            >
              <i className="fab fa-whatsapp"></i> WhatsApp
            </a>
            <button 
              onClick={onCartToggle}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-navy to-brand-navyLight text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <i className="fas fa-shopping-cart"></i>
              <span>Cart</span>
              <span className="ml-1 px-2 py-0.5 bg-brand-terracotta rounded-full text-[10px]">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
