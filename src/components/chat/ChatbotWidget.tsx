import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Trash2, 
  Minimize2, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  FlaskConical,
  Database,
  ShoppingBag,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { MercuryMascot } from '../illustrations/MercuryMascot';
import { BPOM_OFFICIAL_URL } from '../../config/constants';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  action?: {
    type: 'navigate';
    tab: string;
    label: string;
  };
}

interface ChatbotWidgetProps {
  onNavigateTab?: (tab: string) => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

const DEFAULT_CHIPS = [
  { label: '🔬 Cara pakai kit uji', prompt: 'Bagaimana langkah-langkah menggunakan kit kertas uji MERCURY?' },
  { label: '⚠️ Bahaya merkuri', prompt: 'Apa saja bahaya merkuri pada kosmetik untuk kulit dan kesehatan?' },
  { label: '🔎 Ciri krim merkuri', prompt: 'Apa saja ciri-ciri fisik krim yang dicurigai mengandung merkuri?' },
  { label: '🏛️ Cara cek BPOM', prompt: 'Bagaimana cara mengecek keaslian nomor izin BPOM kosmetik?' },
  { label: '🛒 Beli kit strip uji', prompt: 'Bagaimana cara membeli paket kit uji resmi MERCURY?' }
];

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ 
  onNavigateTab,
  isOpenExternal,
  onCloseExternal 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('mercury_chat_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Gagal memuat chat history:', e);
    }

    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: 'Halo! Saya **Merqi**, asisten virtual cerdas MERCURY. 👋🔬\n\nSaya siap membantu Anda memahami **keamanan kosmetik**, **cara pakai kit uji kertas**, bahaya merkuri, hingga verifikasi izin BPOM.\n\nAda yang ingin Anda tanyakan seputar kosmetik hari ini?',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with external opener if provided
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem('mercury_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn('Gagal menyimpan chat history:', e);
    }
  }, [messages]);

  // Scroll to bottom on message update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasInteracted(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (isOpen && onCloseExternal) {
      onCloseExternal();
    }
    setIsOpen(prev => !prev);
  };

  const handleClearHistory = () => {
    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'bot',
      text: 'Riwayat percakapan telah dibersihkan. Saya siap membantu Anda kembali! Silakan ketik pertanyaan atau pilih topik di bawah.',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMsg]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const detectActionLink = (text: string): { type: 'navigate'; tab: string; label: string } | undefined => {
    const lower = text.toLowerCase();
    if (lower.includes('scan') || lower.includes('kamera') || lower.includes('kertas uji')) {
      return { type: 'navigate', tab: 'scan', label: 'Buka Menu Scan Kertas' };
    }
    if (lower.includes('basis data') || lower.includes('database') || lower.includes('direktori')) {
      return { type: 'navigate', tab: 'database', label: 'Jelajahi Basis Data' };
    }
    if (lower.includes('toko') || lower.includes('starter kit') || lower.includes('beli kit')) {
      return { type: 'navigate', tab: 'shop', label: 'Buka Toko Kit Uji' };
    }
    return undefined;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setInputMessage('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call server-side API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6).map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || data.fallbackReply || 'Maaf, belum ada respons yang tersedia.';

      const action = detectActionLink(replyText);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        action
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.warn('Network or API issue, using local knowledge base fallback:', err);
      
      // Smart instant fallback response
      let fallbackText = '';
      const lower = query.toLowerCase();

      if (lower.includes('cara pakai') || lower.includes('cara guna') || lower.includes('cara test') || lower.includes('cara tes')) {
        fallbackText = `Berikut panduan pengujian menggunakan Kit Uji MERCURY:\n\n1. **Letakkan Kertas**: Taruh strip kertas reagen MERCURY di tempat datar.\n2. **Oleskan Sampel**: Ambil krim seukuran biji jagung, oles merata pada lingkaran reagen di bagian tengah.\n3. **Tunggu Reaksi**: Diamkan 1-2 menit hingga reagen bereaksi dengan kemungkinan ion merkuri (Hg²⁺).\n4. **Scan Kamera**: Masuk ke menu **Scan Kertas Uji** di aplikasi, arahkan kamera tegak lurus dengan 4 target kalibrasi warna.\n5. **Hasil Otomatis**: Sistem menghitung pergeseran warna (ΔE) dan perkiraan rentang kadar merkuri (ppm).`;
      } else if (lower.includes('bahaya') || lower.includes('efek') || lower.includes('racun') || lower.includes('rusak')) {
        fallbackText = `Merkuri (Hg) adalah logam berat berbahaya yang dilarang dalam kosmetik:\n\n• **Pada Kulit**: Mengikis skin barrier, sensasi perih terbakar, iritasi, dan menyebabkan *ochronosis* (flek hitam permanen).\n• **Pada Ginjal & Saraf**: Merkuri meresap ke aliran darah, merusak filter ginjal serta menyebabkan gangguan saraf (tremor, insomnia, kecemasan).\n• **Pada Janin**: Menembus plasenta dan memicu kelainan bawaan pada otak janin.\n\nBatas aman BPOM & WHO adalah di bawah 1 ppm (tidak boleh sengaja ditambahkan).`;
      } else if (lower.includes('ciri') || lower.includes('tanda') || lower.includes('krim')) {
        fallbackText = `Ciri-ciri kosmetik yang patut dicurigai mengandung merkuri:\n\n1. **Warna Mengkilap**: Berwarna putih mutiara berkilau (*pearlescent*) atau kuning terang mencolok.\n2. **Tekstur Lengket**: Sulit membaur di kulit atau memisah antara minyak dan padatan.\n3. **Bau Logam**: Bau menyengat yang sering ditutupi parfum tebal.\n4. **Hasil Instan**: Mengklaim memutihkan wajah secara instan dalam 3-7 hari.\n5. **Tanpa Izin BPOM**: Tidak memiliki nomor notifikasi resmi yang terdaftar di cekbpom.pom.go.id.`;
      } else if (lower.includes('bpom') || lower.includes('izin') || lower.includes('legal')) {
        fallbackText = `Cara memastikan izin edar kosmetik:\n\n1. Cek nomor **Notifikasi BPOM** pada kemasan (contoh: **NA18230101234**).\n2. Kunjungi situs resmi **[cekbpom.pom.go.id](https://cekbpom.pom.go.id)** atau buka aplikasi **BPOM Mobile**.\n3. Masukkan nomor izin atau nama merek untuk memastikan statusnya masih aktif.\n4. Anda juga bisa melihat hasil uji komunitas di menu **Basis Data**.`;
      } else if (lower.includes('beli') || lower.includes('order') || lower.includes('harga') || lower.includes('kit')) {
        fallbackText = `Kit strip uji resmi MERCURY dapat dipesan di menu **Toko Kit Uji**:\n\n• **Starter Kit Konsumen** (5 strip uji + kartu kalibrasi)\n• **Family Safety Pack** (15 strip uji)\n• **Lab Bulk Pack** (50 strip uji)\n\nSemua kit dilengkapi formula reagen terstandarisasi untuk deteksi cepat di rumah.`;
      } else {
        fallbackText = `Terima kasih atas pertanyaannya! Sebagai asisten skrining kosmetik MERCURY, saya dapat membantu Anda:\n\n1. Memandu cara menguji krim di menu **Scan Kertas Uji**.\n2. Menjelaskan bahaya merkuri dan ciri-ciri kosmetik ilegal.\n3. Memberikan panduan cek keaslian izin BPOM di **cekbpom.pom.go.id**.\n\nSilakan pilih topik atau tanyakan hal spesifik lainnya.`;
      }

      const action = detectActionLink(fallbackText);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        action
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to format bot markdown text cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold formatting **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        // Link markdown [text](url)
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          return (
            <a 
              key={pIdx} 
              href={linkMatch[2]} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#0F4C5C] font-bold underline hover:text-[#166479]"
            >
              {linkMatch[1]}
            </a>
          );
        }
        return part;
      });

      return (
        <span key={idx} className="block min-h-[1.2em]">
          {renderedLine}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
        {!isOpen && (
          <div className="relative group">
            {/* Tooltip prompt */}
            {!hasInteracted && (
              <div className="hidden sm:flex absolute bottom-full right-0 mb-3 items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 whitespace-nowrap animate-bounce">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Tanya Merqi seputar kosmetik & merkuri</span>
              </div>
            )}

            <button
              onClick={handleToggle}
              className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-[#0F4C5C] hover:bg-[#166479] text-white shadow-xl shadow-[#0F4C5C]/30 border-2 border-white/80 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Buka Chatbot Asisten MERCURY"
            >
              <div className="relative">
                <MercuryMascot mood="wave" size={28} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-black tracking-tight leading-none">Chat Asisten</p>
                <p className="text-[10px] text-teal-200 font-medium">Tanya Merqi</p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Chat Window / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[400px] md:w-[430px] h-full sm:h-[600px] sm:max-h-[85vh] bg-white sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scaleUp">
          
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#0F4C5C] to-[#166479] text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative p-1 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                <MercuryMascot mood="wave" size={34} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0F4C5C] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white tracking-tight">Merqi</h3>
                  <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full text-teal-100">
                    AI Asisten
                  </span>
                </div>
                <p className="text-[11px] text-teal-100/90 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Siap Menjawab & Membantu</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Bersihkan riwayat percakapan"
                className="p-2 rounded-xl text-teal-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={handleToggle}
                title="Tutup chat"
                className="p-2 rounded-xl text-teal-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';

              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="shrink-0 mt-0.5 p-1 rounded-xl bg-teal-50 border border-teal-100 shadow-2xs">
                      <MercuryMascot mood="celebrate" size={24} />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1.5 ${isBot ? 'items-start' : 'items-end'}`}>
                    <div 
                      className={`relative group px-4 py-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs transition-all ${
                        isBot 
                          ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm' 
                          : 'bg-[#0F4C5C] text-white rounded-tr-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        {renderFormattedText(msg.text)}
                      </div>

                      {/* Action button inside bot message if suggested */}
                      {isBot && msg.action && onNavigateTab && (
                        <div className="pt-2.5 mt-2.5 border-t border-slate-100">
                          <button
                            onClick={() => {
                              onNavigateTab(msg.action!.tab);
                              if (window.innerWidth < 640) {
                                setIsOpen(false);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0F4C5C] text-[11px] font-extrabold transition-all border border-teal-200/80 cursor-pointer active:scale-95"
                          >
                            <span>{msg.action.label}</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      )}

                      {/* Copy button */}
                      {isBot && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 right-2 p-1 rounded-md bg-white border border-slate-200 text-slate-400 hover:text-slate-700 shadow-xs cursor-pointer"
                          title="Salin jawaban"
                        >
                          {copiedId === msg.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      )}
                    </div>

                    <div className={`flex items-center gap-1 px-1 text-[10px] text-slate-400 font-medium ${isBot ? 'justify-start' : 'justify-end'}`}>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="shrink-0 p-1 rounded-xl bg-teal-50 border border-teal-100 shadow-2xs">
                  <MercuryMascot mood="curious" size={24} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0F4C5C] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#0F4C5C] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#0F4C5C] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-500 font-medium pl-1">Merqi sedang berpikir...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {DEFAULT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.prompt)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-[#0F4C5C] text-slate-600 text-[11px] font-bold transition-all border border-slate-200/60 cursor-pointer disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanyakan apa saja seputar merkuri..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100/90 focus:bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15 outline-none transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 rounded-2xl bg-[#0F4C5C] hover:bg-[#166479] disabled:bg-slate-200 text-white disabled:text-slate-400 shadow-md shadow-[#0F4C5C]/20 transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95 shrink-0"
              aria-label="Kirim Pesan"
            >
              <Send size={16} />
            </button>
          </form>

          {/* Safety footer disclaimer */}
          <div className="px-4 py-1.5 bg-slate-100/70 border-t border-slate-200/60 text-center text-[10px] text-slate-500 font-medium">
            <span>Didukung AI MERCURY. Selalu verifikasi izin resmi di </span>
            <a 
              href={BPOM_OFFICIAL_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#0F4C5C] font-bold hover:underline"
            >
              cekbpom.pom.go.id
            </a>
          </div>

        </div>
      )}
    </>
  );
};
