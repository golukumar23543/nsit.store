
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <div className="group bg-white rounded-[28px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-navy to-brand-terracotta opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative h-60 overflow-hidden bg-slate-100">
        <img 
          src={product.img} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-800 flex items-center gap-1 shadow-sm">
          <i className="fas fa-star text-brand-terracotta"></i> {product.rating}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <span className="text-[10px] uppercase font-bold tracking-widest text-brand-terracotta mb-1">{product.cat}</span>
        <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{product.desc}</p>
        
        <div className="flex items-center gap-2 mb-4 bg-slate-100 w-fit px-3 py-1 rounded-full text-xs font-semibold text-brand-navy">
          <i className="fas fa-shopping-bag text-[10px]"></i> {product.orderCount} orders
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-brand-navy leading-none">₹{product.price}</span>
            <span className="text-[11px] font-medium text-slate-400 mt-1.5 bg-slate-50 px-2 py-0.5 rounded-full inline-block">Approx {product.usd}</span>
          </div>
          <button 
            onClick={onAdd}
            className="w-12 h-12 bg-gradient-to-br from-brand-navy to-brand-navyLight text-white rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg hover:from-brand-terracotta hover:to-brand-terracottaLight transition-all duration-300"
          >
            <i className="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
