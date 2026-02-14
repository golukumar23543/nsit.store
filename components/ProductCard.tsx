import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-white rounded-[20px] md:rounded-[28px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl md:hover:-translate-y-2 transition-all duration-300 relative flex flex-col h-full">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-navy to-brand-terracotta opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative h-48 md:h-60 overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
        {!imgError ? (
          <img 
            src={product.img} 
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <i className="fas fa-image text-3xl mb-2 opacity-50"></i>
            <span className="text-[10px] font-bold uppercase tracking-wider">Image Preview Unavailable</span>
          </div>
        )}
        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/95 backdrop-blur px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold text-slate-800 flex items-center gap-1 shadow-sm">
          <i className="fas fa-star text-brand-terracotta"></i> {product.rating}
        </div>
      </div>

      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <span className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-brand-terracotta mb-1">{product.cat}</span>
        <h3 className="text-base md:text-xl font-bold text-slate-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs md:text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed min-h-[2.5rem] md:min-h-[3rem]">{product.desc}</p>
        
        <div className="flex items-center gap-1.5 md:gap-2 mb-4 bg-slate-100 w-fit px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold text-brand-navy">
          <i className="fas fa-shopping-bag text-[8px] md:text-[10px]"></i> {product.orderCount} <span className="hidden xs:inline">orders</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-black text-brand-navy leading-none">₹{product.price}</span>
            <span className="text-[9px] md:text-[11px] font-medium text-slate-400 mt-1 md:mt-1.5 bg-slate-50 px-1.5 md:px-2 py-0.5 rounded-full inline-block">Approx {product.usd}</span>
          </div>
          <button 
            onClick={onAdd}
            aria-label="Add to cart"
            className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-brand-navy to-brand-navyLight text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg hover:from-brand-terracotta hover:to-brand-terracottaLight transition-all duration-300 active:scale-90"
          >
            <i className="fas fa-cart-plus text-sm md:text-base"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;