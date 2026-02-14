
import React from 'react';
import { Category } from '../types';

interface CategoryBarProps {
  active: Category;
  onChange: (cat: Category) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ active, onChange }) => {
  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'books', label: 'Books' },
  ];

  return (
    <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-hide">
      <div className="inline-flex bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`
              px-8 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap
              ${active === cat.id 
                ? 'bg-brand-navy text-white shadow-md' 
                : 'text-slate-500 hover:text-brand-navy hover:bg-slate-50'}
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
