import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Trash2, 
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { MercuryDropletMark } from '../common/MercuryLogo';
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

const WELCOME_TEXT = "Hai, aku Mercy, asisten MERCURY! Aku bisa bantu soal cara pakai Hg Test Kit, arti hasil tes, dan cara baca Hasil Tes dari komunitas. Mau tanya apa?";

// 4 Tombol Pertanyaan Cepat Sesuai Permintaan
const QUICK_QUESTIONS = [
  { 
    label: 'Cara pakai kit', 
    prompt: 'Bagaimana cara pakai Hg Test Kit?' 
  },
  { 
    label: 'Arti hasil Terindikasi', 
    prompt: 'Apa arti hasil status Terindikasi?' 
  },
  { 
    label: 'Boleh pakai kertas dari tempat lain?', 
    prompt: 'Boleh pakai kertas dari tempat lain?' 
  },
  { 
    label: 'Kalau terindikasi, harus apa?', 
    prompt: 'Kalau hasil tes terindikasi, harus apa?' 
  }
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
        const parsed = JSON.parse(saved);
        // Pastikan nama lama tidak terbawa dari session lama
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map((m: ChatMessage) => {
            if (m.id === 'msg-welcome' || m.text.includes('Merqi')) {
              return {
                ...m,
                text: WELCOME_TEXT
              };
            }
            return m;
          });
          return sanitized;
        }
      }
    } catch (e) {
      console.warn('Gagal memuat chat history:', e);
    }

    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: WELCOME_TEXT,
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
      text: WELCOME_TEXT,
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
    if (lower.includes('scan') || lower.includes('kamera') || lower.includes('menu scan')) {
      return { type: 'navigate', tab: 'scan', label: 'Buka Menu Scan' };
    }
    if (lower.includes('hasil tes') || lower.includes('komunitas') || lower.includes('basis data')) {
      return { type: 'navigate', tab: 'database', label: 'Lihat Hasil Tes Komunitas' };
    }
    if (lower.includes('toko') || lower.includes('hg test kit') || lower.includes('beli')) {
      return { type: 'navigate', tab: 'shop', label: 'Lihat Hg Test Kit' };
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
      // Panggil server-side API endpoint
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
      const replyText = data.reply || data.fallbackReply || 'Hai! Ada kendala jaringan sebentar, silakan tanyakan lagi ke Mercy ya.';

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
      console.warn('Network issue or offline mode, using Mercy smart response fallback:', err);
      
      // Fallback response strictly adhering to Mercy rules
      let fallbackText = '';
      const lower = query.toLowerCase();

      if (lower.includes('cara pakai') || lower.includes('langkah') || lower.includes('cara guna') || lower.includes('cara uji') || lower.includes('cara tes')) {
        fallbackText = 'Untuk pakai Hg Test Kit, ambil sedikit sampel krim pakai alat sekali pakai, lalu teteskan di zona tetes pada kertas uji. Tunggu reaksinya sesuai panduan bergambar. Setelah itu, foto bersama kartu referensi warna di pencahayaan cukup tanpa flash dan latar putih lewat menu Scan. Ingat ya, hasil ini adalah skrining awal, bukan pengganti uji laboratorium!';
      } else if (lower.includes('arti') && lower.includes('terindikasi')) {
        fallbackText = 'Status "Terindikasi" berarti reaksi warna pada kertas uji menunjukkan kemungkinan adanya kandungan merkuri pada sampel skrining awal. Ini bukan konfirmasi laboratorium definitif. Jika hasil terindikasi, sebaiknya segera hentikan pemakaian produk, lakukan konfirmasi ke laboratorium terakreditasi, dan laporkan ke BPOM.';
      } else if (lower.includes('tempat lain') || lower.includes('kertas lain') || (lower.includes('boleh') && lower.includes('kertas'))) {
        fallbackText = 'Tentu boleh! Scan dan unggah hasil di MERCURY gratis untuk semua orang, dan kamu tidak wajib membeli kit di sini. Kalau kamu memakai kertas dari sumber lain, hasilnya tetap bisa diunggah namun akan diberi catatan khusus dan tingkat kepercayaan data yang lebih rendah.';
      } else if (lower.includes('harus apa') || (lower.includes('kalau') && lower.includes('terindikasi')) || (lower.includes('jika') && lower.includes('terindikasi'))) {
        fallbackText = 'Jika hasil skrining awal terindikasi merkuri, pertama segera hentikan pemakaian produk. Kedua, lakukan konfirmasi ke laboratorium terakreditasi untuk memastikan kandungannya. Terakhir, laporkan temuan tersebut ke BPOM. Jika kulitmu terasa sakit atau iritasi, segera konsultasikan ke dokter atau fasilitas kesehatan ya.';
      } else if (lower.includes('akurasi') || lower.includes('sensitivitas') || lower.includes('berapa persen')) {
        fallbackText = 'Hg Test Kit saat ini masih tahap prototipe dan validasi laboratorium sedang direncanakan, jadi kami tidak menyebutkan angka akurasi atau sensitivitas tertentu. Hasil uji berfungsi sebagai skrining awal mandiri bagi masyarakat.';
      } else if (lower.includes('isi kit') || lower.includes('hg test kit') || lower.includes('beli') || lower.includes('harga')) {
        fallbackReplyText:
        fallbackText = 'Hg Test Kit berisi 5 strip kertas uji merkuri, 2 kartu referensi warna, 5 alat ambil sampel sekali pakai, panduan bergambar dan skala warna, serta kode batch MRC-2026-A05 dan QR. Kit ini bisa mengecek satu rangkaian skincare-mu (krim siang, krim malam, toner, serum, sabun). Harga di web merupakan harga simulasi untuk prototipe.';
      } else if (lower.includes('bahaya') || lower.includes('efek') || lower.includes('racun')) {
        fallbackText = 'Merkuri adalah logam berat berbahaya yang dilarang dalam kosmetik karena bisa merusak lapisan pelindung kulit dan memicu flek hitam yang sulit hilang. Jika terserap ke tubuh, merkuri berisiko merusak ginjal serta sistem saraf. Pastikan selalu mengecek izin resmi di cekbpom.pom.go.id ya!';
      } else if (lower.includes('halo') || lower.includes('hai') || lower.includes('mercy')) {
        fallbackText = 'Hai, aku Mercy, asisten MERCURY! Aku bisa bantu soal cara pakai Hg Test Kit, arti hasil tes, dan cara baca Hasil Tes dari komunitas. Mau tanya apa?';
      } else {
        fallbackText = 'Hai! Mercy fokus membantu skrining awal merkuri dan fitur di MERCURY. Kamu bisa tanya cara pakai Hg Test Kit, arti status hasil seperti Terindikasi, atau cara baca Hasil Tes komunitas. Ada yang ingin kamu tanyakan seputar skrining merkuri?';
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
                <span>Tanya Mercy seputar Hg Test Kit & hasil skrining</span>
              </div>
            )}

            {/* Tombol Melayang: "Tanya Mercy" dengan ikon tetesan dari logo MERCURY */}
            <button
              onClick={handleToggle}
              className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0F4C5C] hover:bg-[#166479] text-white shadow-xl shadow-[#0F4C5C]/35 border-2 border-white/90 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Tanya Mercy"
            >
              <div className="relative flex items-center justify-center">
                <MercuryDropletMark size={20} variant="light" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0F4C5C] rounded-full" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold tracking-tight">
                Tanya Mercy
              </span>
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
              <div className="relative p-2 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center">
                <MercuryDropletMark size={22} variant="light" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0F4C5C] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white tracking-tight">Mercy</h3>
                  <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full text-teal-100">
                    Asisten MERCURY
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
                title="Tutup jendela chat"
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
                      <MercuryDropletMark size={16} variant="colored" />
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
                  <MercuryDropletMark size={16} variant="colored" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0F4C5C] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#0F4C5C] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#0F4C5C] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-500 font-medium pl-1">Mercy sedang mengetik...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 4 Tombol Pertanyaan Cepat Sesuai Permintaan */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_QUESTIONS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.prompt)}
                disabled={isLoading}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-[#0F4C5C] text-slate-700 text-[11px] font-bold transition-all border border-slate-200/80 cursor-pointer disabled:opacity-50 active:scale-95 whitespace-nowrap"
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
              placeholder="Tanya Mercy seputar skrining merkuri..."
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
            <span>Hasil MERCURY adalah skrining awal, bukan pengganti uji laboratorium.</span>
          </div>

        </div>
      )}
    </>
  );
};
