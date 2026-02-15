import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getGeminiStream } from '../geminiService';

interface ChatBotProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const FormattedMessage: React.FC<{ content: string; role: 'user' | 'bot' }> = ({ content, role }) => {
  if (role === 'user') return <>{content}</>;

  // Parsing logic for "Designed" responses
  const lines = content.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        let processedLine = line.trim();
        if (!processedLine) return <div key={idx} className="h-2" />;

        // Handle Bullet Points
        const isBullet = processedLine.startsWith('•') || processedLine.startsWith('*') || processedLine.startsWith('-');
        if (isBullet) {
          const text = processedLine.replace(/^[•*-]\s*/, '');
          return (
            <div key={idx} className="flex gap-2 items-start pl-1">
              <span className="text-brand-terracotta mt-1 text-[8px]"><i className="fas fa-circle"></i></span>
              <span className="flex-grow">{formatInLineText(text)}</span>
            </div>
          );
        }

        return <div key={idx}>{formatInLineText(processedLine)}</div>;
      })}
    </div>
  );
};

// Helper to bold and colorize specific patterns in line
const formatInLineText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|₹\d+(?:,\d+)*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-black">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('₹')) {
      return <span key={i} className="text-brand-terracotta font-black tracking-tight">{part}</span>;
    }
    return part;
  });
};

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: 'Welcome to the **NSIP VIP Terminal**. How may I assist your digital procurement today?' }
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
    
    // Add user message and a placeholder bot message for streaming
    setMessages(prev => [
      ...prev, 
      { role: 'user', content: userMsg },
      { role: 'bot', content: '' }
    ]);
    setIsLoading(true);

    try {
      const stream = await getGeminiStream(userMsg);
      let fullText = "";
      
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          // Update the last message (the bot's response) with the new chunk
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'bot', content: fullText };
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          role: 'bot', 
          content: "Our Premium Concierge is briefly offline. Please contact our direct terminal at +91 87091 07808 for immediate assistance." 
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "Latest Inventory",
    "How to Pay?",
    "Bulk Orders"
  ];

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[200] flex flex-col items-end">
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[400px] h-[80vh] sm:h-[600px] bg-slate-950/90 backdrop-blur-2xl rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col mb-6 overflow-hidden animate-in slide-in-from-bottom-8 duration-500 ease-out">
          {/* Premium Header */}
          <div className="bg-white/5 border-b border-white/5 p-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-navy to-brand-terracotta rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-brand-terracotta/20">
                  <i className="fas fa-bolt-lightning"></i>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-950 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black tracking-tight text-lg">NSIP Concierge</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Live Agent Active</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg, i) => (
              msg.content || msg.role === 'user' ? (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`
                    max-w-[85%] px-5 py-4 rounded-[24px] text-sm leading-relaxed shadow-xl
                    ${msg.role === 'user' 
                      ? 'bg-gradient-to-br from-brand-terracotta to-purple-600 text-white rounded-br-none font-bold' 
                      : 'bg-slate-900/80 border border-white/10 text-slate-300 rounded-bl-none'}
                  `}>
                    <FormattedMessage content={msg.content} role={msg.role} />
                  </div>
                </div>
              ) : null
            ))}
            {isLoading && messages[messages.length-1].content === '' && (
              <div className="flex justify-start">
                <div className="bg-slate-900/50 border border-white/5 px-6 py-4 rounded-[24px] rounded-bl-none flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-terracotta rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-terracotta rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-terracotta rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white/5 border-t border-white/5 space-y-4 shrink-0">
            {/* Quick Actions */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickActions.map(action => (
                <button 
                  key={action}
                  onClick={() => { setInput(action); }}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-brand-terracotta transition-all whitespace-nowrap"
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Secure terminal input..."
                className="flex-grow bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-brand-terracotta/50 transition-all text-white placeholder:text-slate-600 font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-14 h-14 bg-white text-slate-950 rounded-2xl flex items-center justify-center disabled:opacity-20 transition-all hover:bg-brand-terracotta hover:text-white shadow-lg active:scale-95 shrink-0"
              >
                <i className="fas fa-paper-plane text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-110 active:scale-90 relative group overflow-hidden
          ${isOpen ? 'bg-white text-slate-950 rotate-90' : 'bg-gradient-to-br from-brand-navy via-brand-terracotta to-purple-600'}
        `}
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <i className={`fas ${isOpen ? 'fa-times text-2xl' : 'fa-robot text-2xl md:text-3xl'}`}></i>
        
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white text-brand-terracotta rounded-full flex items-center justify-center text-[10px] font-black shadow-lg border-2 border-slate-950">
            1
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatBot;