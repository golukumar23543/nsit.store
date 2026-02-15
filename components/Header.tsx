import React from 'react';
import { STORE_CONTACT } from '../constants';

interface HeaderProps {
  cartCount: number;
  onCartToggle: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartToggle, onLogoClick }) => {
  return (
    <header className="sticky top-0 z-[100] bg-slate-950/60 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-28">
          <div 
            className="flex items-center gap-3 md:gap-4 cursor-pointer select-none group"
            onClick={onLogoClick}
          >
            <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-brand-navy to-brand-terracotta text-white rounded-[18px] flex items-center justify-center font-black text-xl md:text-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-all">
              NS
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter leading-none group-hover:text-brand-terracotta transition-colors">NSIP</h1>
              <p className="hidden xs:block text-[9px] md:text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-1.5 opacity-60">Verified Store</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden lg:flex items-center gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
               <a href="#" className="hover:text-white transition-colors">Home</a>
               <a href="#" className="hover:text-white transition-colors">Inventory</a>
               <a href="#" className="hover:text-white transition-colors">VIP Access</a>
            </div>

            <div className="h-6 w-px bg-white/5 hidden lg:block"></div>

            <div className="flex items-center gap-2 md:gap-4">
              <a 
                href={`https://wa.me/${STORE_CONTACT.whatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/5 text-emerald-400 hover:bg-emerald-400 hover:text-white transition-all shadow-lg"
              >
                <i className="fab fa-whatsapp text-lg"></i>
              </a>
              
              <button 
                onClick={onCartToggle}
                className="relative flex items-center gap-3 px-5 md:px-8 py-2.5 md:py-3.5 rounded-2xl bg-white text-slate-950 font-black text-xs md:text-sm hover:bg-brand-terracotta hover:text-white transition-all shadow-2xl hover:-translate-y-0.5 active:scale-95"
              >
                <i className="fas fa-shopping-cart"></i>
                <span className="hidden xs:inline uppercase tracking-widest">Inventory</span>
                <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-brand-terracotta text-white rounded-lg text-[10px] shadow-inner">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;