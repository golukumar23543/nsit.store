
import React from 'react';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-10 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-8 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-slate-800">
        <i className="fas fa-check-circle text-orange-500"></i>
        <span className="font-semibold text-sm">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
