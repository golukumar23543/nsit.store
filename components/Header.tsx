import React from 'react';
import { STORE_CONTACT } from '../constants';

interface HeaderProps {
  cartCount: number;
  onCartToggle: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartToggle, onLogoClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-2 sm:px-0">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-24">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer select-none group"
            onClick={onLogoClick}
          >
            <div className="w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-brand-navy to-brand-terracotta text-white rounded-xl md:rounded-2xl flex items-center justify-center font-bold text-base md:text-xl shadow-lg group-hover:scale-105 transition-transform">
              NS
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-navy to-brand-terracotta leading-none">NSIP</h1>
              <p className="hidden xs:block text-[8px] md:text-xs text-slate-600 uppercase tracking-wider font-medium mt-1">Premium Shop</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-4">
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
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#e8f5e9] text-[#1b5e3f] border border-[#a5d6a7] font-semibold text-sm hover:bg-[#c8e6c9] transition-colors shadow-sm"
            >
              <i className="fab fa-whatsapp"></i> <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button 
              onClick={onCartToggle}
              className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-brand-navy to-brand-navyLight text-white font-semibold text-xs md:text-sm hover:opacity-90 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              <i className="fas fa-shopping-cart"></i>
              <span className="hidden xs:inline">Cart</span>
              <span className="px-1.5 md:px-2 py-0.5 bg-brand-terracotta rounded-full text-[9px] md:text-[10px]">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;