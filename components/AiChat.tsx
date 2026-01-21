
import React, { useState, useRef, useEffect } from 'react';
import { getAiResponse } from '../services/geminiService.ts';
import { ChatMessage } from '../types.ts';
import { useStore } from '../store/useStore.ts';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

const AiChat: React.FC<Props> = ({ isOpen, onToggle }) => {
  const aiInstruction = useStore(state => state.aiInstruction);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome. I am Usman's neural proxy. How can I assist you in exploring his capabilities today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await getAiResponse(userMsg, aiInstruction);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <>
      <button 
        onClick={onToggle}
        className="fixed bottom-8 right-8 z-[60] bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-110 neo-shadow animate-bounce"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 z-[60] w-[calc(100%-4rem)] md:w-full max-w-[360px] h-[500px] glass rounded-3xl shadow-2xl overflow-hidden border border-blue-500/20 flex flex-col animate-in slide-in-from-bottom-5">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-blue-600/10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-futuristic font-bold text-sm tracking-widest">USMAN_AI v1.0</span>
            </div>
            <button onClick={onToggle} className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scroll-smooth">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/10'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-gray-950/50">
            <div className="relative flex items-center">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about Usman..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-xs focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="absolute right-2 text-blue-500 hover:text-blue-400 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <div className="mt-2 text-[10px] text-gray-600 text-center uppercase tracking-tighter">Powered by Gemini Neural Network</div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChat;
