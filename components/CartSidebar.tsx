
import React from 'react';
import { CartItem } from '../types';
import { STORE_CONTACT } from '../constants';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, total, onRemove, onClear }) => {
  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    
    const messageLines = items.map(item => `• ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`);
    const message = encodeURIComponent(
      `*New Order from NSIP Store*\n\n${messageLines.join('\n')}\n\n*Total: ₹${total}*\n\nPlease confirm my order.`
    );
    window.open(`https://wa.me/${STORE_CONTACT.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[60] shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <i className="fas fa-times text-xl text-slate-500"></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <i className="fas fa-shopping-basket text-5xl mb-4 opacity-20"></i>
              <p className="font-medium text-lg">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="mt-4 text-orange-600 font-bold hover:underline"
              >
                Go shopping
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 group">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-20 h-20 object-cover rounded-2xl shadow-sm"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 leading-tight">{item.name}</h4>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <i className="far fa-trash-alt text-sm"></i>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">₹{item.price} × {item.quantity}</p>
                  <p className="text-sm font-bold text-slate-800 mt-2">₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-2xl font-black text-slate-900">₹{total}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onClear}
                className="py-3 px-4 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors text-sm"
              >
                Clear
              </button>
              <button 
                onClick={handleWhatsAppOrder}
                className="py-3 px-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                Checkout <i className="fab fa-whatsapp"></i>
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-widest">
              Secured Checkout via WhatsApp
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
