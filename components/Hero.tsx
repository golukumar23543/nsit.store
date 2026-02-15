import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8 md:py-16">
      {/* Premium Dashboard Card */}
      <div className="relative bg-[#0c1729]/80 backdrop-blur-xl rounded-[40px] p-8 md:p-20 overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 border-2 border-slate-700/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 border-2 border-slate-700/20 rounded-full"></div>
        <div className="absolute top-1/4 right-10 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-slate-700/30 rotate-12"></div>
        <div className="absolute bottom-1/4 left-20 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-slate-700/20 -rotate-12"></div>
        
        {/* Content Area */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 px-6 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
            Official Partner 2024
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Premium Tools.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-terracotta to-purple-400">Zero Waiting.</span>
          </h1>
          
          <p className="max-w-xl text-slate-400 text-sm md:text-lg mb-10 leading-relaxed font-medium">
            Access the world's best digital services and premium products instantly. 
            From AI tools to high-end lifestyle items, we provide the best at unmatchable prices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-brand-terracotta to-purple-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_10px_30px_rgba(183,92,59,0.3)] hover:scale-105 active:scale-95 transition-all">
              Browse VIP Inventory
            </button>
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
              <i className="fab fa-whatsapp text-emerald-400 text-xl"></i>
              <div className="text-left">
                <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Support</span>
                <span className="text-white font-bold text-sm">8709107808</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Logo Mockup (Like in User's Image) */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-slate-900/40 rounded-full border border-white/5 backdrop-blur-3xl hidden xl:flex items-center justify-center opacity-40">
           <div className="text-6xl font-black text-white/10 select-none">NSIP</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;