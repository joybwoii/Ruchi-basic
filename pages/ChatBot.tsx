
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { RuchiLogo } from '../constants';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const ChatBot: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hello! I'm Ruchi AI. Ask me anything about Kerala's food spots, recipes, or culinary traditions!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are Ruchi AI, an expert on Kerala food, restaurants, and culture. Be friendly, authentic, and concise. Use Malayalam terms where appropriate (like 'Sadhya', 'Puttu', 'Meen Curry').",
        },
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm not sure about that. Try asking something else about local food!" }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to the kitchen. Try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white animate-in slide-in-from-right duration-500">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="text-slate-400 p-2 bg-slate-50 rounded-2xl active:scale-90 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-black text-[#0F172A] tracking-tight uppercase">Ruchi AI Assistant</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Explorer</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-5 rounded-[32px] text-sm font-bold leading-relaxed shadow-sm border ${
              msg.role === 'user' 
                ? 'bg-[#065F46] text-white border-[#065F46] rounded-br-lg' 
                : 'bg-slate-50 text-slate-700 border-slate-100 rounded-bl-lg'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-slate-50 p-5 rounded-[32px] rounded-bl-lg border border-slate-100 flex gap-2">
              <div className="w-1.5 h-1.5 bg-[#065F46] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#065F46] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-[#065F46] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-slate-100 pb-10">
        <div className="relative group">
          <input 
            type="text"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] py-5 px-8 pr-20 text-sm font-bold focus:ring-4 focus:ring-[#065F46]/5 focus:border-[#065F46] outline-none transition-all placeholder:text-slate-300"
            placeholder="Ask Ruchi AI..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#065F46] text-white rounded-[20px] flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
        <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest mt-4">Powered by Gemini 3.0 Pro</p>
      </div>
    </div>
  );
};

export default ChatBot;
