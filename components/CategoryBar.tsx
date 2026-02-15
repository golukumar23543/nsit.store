import React from 'react';
import { Category } from '../types';

interface CategoryBarProps {
  active: Category;
  onChange: (cat: Category) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ active, onChange }) => {
  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'all', label: 'All Assets', icon: 'fa-globe' },
    { id: 'clothing', label: 'Lifestyle', icon: 'fa-tshirt' },
    { id: 'electronics', label: 'Tech & Studio', icon: 'fa-microchip' },
    { id: 'books', label: 'Library', icon: 'fa-book-open' },
  ];

  return (
    <div className="flex justify-center w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="inline-flex bg-slate-900/50 backdrop-blur-xl p-2 rounded-[24px] border border-white/5 shadow-2xl">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`
              flex items-center gap-3 px-6 md:px-10 py-3 md:py-4 rounded-[18px] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
              ${active === cat.id 
                ? 'bg-white text-slate-950 shadow-[0_10px_30px_rgba(255,255,255,0.1)]' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'}
            `}
          >
            <i className={`fas ${cat.icon} ${active === cat.id ? 'text-brand-terracotta' : 'opacity-40'}`}></i>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;