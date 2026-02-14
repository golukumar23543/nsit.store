import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { askGemini } from '../geminiService';

interface ChatBotProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: 'Hi there! 👋 I\'m your NSIP AI assistant. Ask me about our products, prices, or store policies!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const botResponse = await askGemini(userMsg);
    setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[340px] h-[70vh] sm:h-[500px] bg-white rounded-[24px] md:rounded-[32px] shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-brand-navy to-brand-terracotta p-4 md:p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-xs">
                <i className="fas fa-sparkles"></i>
              </div>
              <span className="text-white font-bold tracking-tight text-sm md:text-base">NSIP AI Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors p-2"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 md:p-5 space-y-4 bg-[#f9fbfd]">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[85%] px-4 py-2.5 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-brand-navy text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'}
                `}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-400 border border-slate-200 px-4 py-2 rounded-2xl rounded-bl-none text-xs flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce [animation-delay:0.2s]">●</span>
                  <span className="animate-bounce [animation-delay:0.4s]">●</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 md:p-4 bg-white border-t border-slate-200 flex gap-2 shrink-0">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-grow bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl px-4 py-2 md:py-2.5 text-xs md:text-sm outline-none focus:ring-2 focus:ring-brand-navy/10 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 md:w-12 md:h-12 bg-brand-navy text-white rounded-xl md:rounded-2xl flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105 shrink-0"
            >
              <i className="fas fa-paper-plane text-xs md:text-sm"></i>
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95
          ${isOpen ? 'bg-brand-terracotta rotate-90' : 'bg-gradient-to-br from-brand-navy to-brand-terracotta'}
        `}
      >
        <i className={`fas ${isOpen ? 'fa-times text-xl' : 'fa-robot text-xl md:text-2xl'}`}></i>
      </button>
    </div>
  );
};

export default ChatBot;