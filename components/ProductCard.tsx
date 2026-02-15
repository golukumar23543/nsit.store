import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative bg-slate-900/40 rounded-[32px] overflow-hidden border border-white/5 hover:border-brand-terracotta/30 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 flex flex-col h-full">
      {/* Premium Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-terracotta/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      {/* Image Container */}
      <div className="relative h-56 md:h-64 overflow-hidden shrink-0">
        {!imgError ? (
          <img 
            src={product.img} 
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
            <i className="fas fa-image text-4xl mb-3 opacity-20"></i>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Preview Unavailable</span>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white flex items-center gap-1.5 shadow-lg">
          <i className="fas fa-star text-brand-terracotta"></i> {product.rating}
        </div>

        {/* Category Label Overlay */}
        <div className="absolute bottom-4 left-4 bg-brand-terracotta px-3 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-xl">
          {product.cat}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10">
        <h3 className="text-xl md:text-2xl font-black text-white mb-3 group-hover:text-brand-terracotta transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-xs md:text-sm text-slate-400 mb-6 line-clamp-2 leading-relaxed font-medium min-h-[3rem] opacity-70">
          {product.desc}
        </p>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400">
            <i className="fas fa-fire-flame-curved text-orange-400"></i> {product.orderCount} <span className="opacity-60">Sales</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest">
            Verified
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tighter">₹{product.price}</span>
            <span className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest">Global Est: {product.usd}</span>
          </div>
          <button 
            onClick={onAdd}
            aria-label="Add to cart"
            className="w-12 h-12 md:w-14 md:h-14 bg-white text-slate-950 rounded-2xl flex items-center justify-center shadow-xl hover:bg-brand-terracotta hover:text-white hover:-translate-y-1 transition-all active:scale-90"
          >
            <i className="fas fa-plus text-base md:text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;