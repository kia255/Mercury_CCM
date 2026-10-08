import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Initialize Gemini API client if key is configured
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Knowledge System Instruction for MERCURY Chatbot (Mercy)
  const SYSTEM_INSTRUCTION = `Kamu adalah Mercy, asisten virtual MERCURY. Jawab dalam Bahasa Indonesia yang santai tapi sopan, singkat (maksimal 4-5 kalimat), tanpa istilah teknis berlebihan.

Yang boleh dibahas:
- Hg Test Kit: isi 5 strip kertas uji merkuri, 2 kartu referensi warna, 5 alat ambil sampel sekali pakai, panduan bergambar dan skala warna, kode batch dan QR. Harga di web adalah simulasi.
- Cara pakai: ambil sampel, teteskan di zona tetes, tunggu sesuai panduan, foto bersama kartu referensi (cahaya cukup, tanpa flash, latar putih).
- Arti status hasil: Tidak terdeteksi, Terindikasi, Perlu uji lanjut, Belum diuji.
- Fitur web: Hasil Tes dari komunitas, Scan, tingkat kepercayaan data, Laporkan Data, sanggahan produsen.
- Scan dan unggah hasil GRATIS untuk semua orang. Membeli kit di MERCURY tidak wajib; kertas dari sumber lain boleh dipakai, hasilnya diberi catatan dan tingkat kepercayaan lebih rendah.
- Informasi umum tentang bahaya merkuri secara singkat.

Aturan wajib:
1. Selalu sebut hasil sebagai "skrining awal", bukan konfirmasi laboratorium. Jangan pernah bilang produk "pasti aman", "pasti berbahaya", "palsu", atau "terbukti". Gunakan "terindikasi" dan "tidak terdeteksi".
2. Jangan menyebut akurasi atau angka sensitivitas kit. Jika ditanya, jawab bahwa kit masih tahap prototipe dan validasi laboratorium sedang direncanakan.
3. Jangan mengarang data produk. Jika produk tidak ada di Hasil Tes, jawab "Belum ada data untuk produk ini", lalu ajak pengguna mengujinya atau cek BPOM di cekbpom.pom.go.id.
4. Jangan memberi diagnosis atau saran pengobatan. Jika pengguna merasa sakit atau terpapar, sarankan segera ke dokter atau fasilitas kesehatan.
5. Jika hasil terindikasi, sarankan: hentikan pemakaian, konfirmasi ke laboratorium terakreditasi, laporkan ke BPOM.
6. Jangan menyebut kelebihan palsu: tidak ada "prioritas" atau "akses khusus" bagi pembeli kit.
7. Jangan meminta data pribadi (nama lengkap, alamat, nomor HP) di chat.
8. Jika pertanyaan di luar topik (skincare umum, hal lain), jawab singkat bahwa Mercy fokus pada skrining merkuri, lalu arahkan kembali.
9. Jangan menyebut dirimu "Merqi" atau nama lama apa pun.`;

  // Server-side Chat API
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
      }

      if (ai) {
        try {
          const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

          if (Array.isArray(history)) {
            for (const item of history.slice(-6)) {
              if (item.sender === 'user' && item.text) {
                contents.push({ role: 'user', parts: [{ text: item.text }] });
              } else if (item.sender === 'bot' && item.text) {
                contents.push({ role: 'model', parts: [{ text: item.text }] });
              }
            }
          }

          contents.push({ role: 'user', parts: [{ text: message }] });

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
              topP: 0.95,
            },
          });

          const reply = response.text;
          if (reply && reply.trim()) {
            return res.json({ reply });
          }
        } catch (apiErr) {
          console.warn('Gemini API call failed, falling through to knowledge base:', apiErr);
        }
      }

      // Offline / Intelligent fallback response
      const lower = message.toLowerCase();
      let fallbackReply = '';

      if (lower.includes('cara pakai') || lower.includes('langkah') || lower.includes('cara guna') || lower.includes('cara uji') || lower.includes('cara tes')) {
        fallbackReply = 'Untuk pakai Hg Test Kit, ambil sedikit sampel krim pakai alat sekali pakai, lalu teteskan di zona tetes pada kertas uji. Tunggu reaksinya sesuai durasi di panduan bergambar. Setelah itu, foto bersama kartu referensi warna di cahaya cukup tanpa flash dan latar putih lewat menu Scan. Ingat ya, hasil ini adalah skrining awal, bukan pengganti uji laboratorium!';
      } else if (lower.includes('arti') && lower.includes('terindikasi')) {
        fallbackReply = 'Status "Terindikasi" berarti reaksi warna pada kertas uji menunjukkan kemungkinan adanya kandungan merkuri pada sampel skrining awal. Ini bukan konfirmasi laboratorium definitif. Jika hasil terindikasi, sebaiknya segera hentikan pemakaian produk, lakukan konfirmasi ke laboratorium terakreditasi, dan laporkan ke BPOM.';
      } else if (lower.includes('tempat lain') || lower.includes('kertas lain') || (lower.includes('boleh') && lower.includes('kertas'))) {
        fallbackReply = 'Tentu boleh! Scan dan unggah hasil di MERCURY gratis untuk semua orang, dan kamu tidak wajib membeli kit di sini. Kalau kamu memakai kertas dari sumber lain, hasilnya tetap bisa diunggah namun akan diberi catatan khusus dan tingkat kepercayaan data yang lebih rendah.';
      } else if (lower.includes('harus apa') || (lower.includes('kalau') && lower.includes('terindikasi')) || (lower.includes('jika') && lower.includes('terindikasi'))) {
        fallbackReply = 'Jika hasil skrining awal terindikasi merkuri, pertama segera hentikan pemakaian produk. Kedua, lakukan konfirmasi ke laboratorium terakreditasi untuk memastikan kandungannya. Terakhir, laporkan temuan tersebut ke BPOM. Jika kulitmu terasa sakit atau iritasi, segera konsultasikan ke dokter atau fasilitas kesehatan ya.';
      } else if (lower.includes('akurasi') || lower.includes('sensitivitas') || lower.includes('berapa persen')) {
        fallbackReply = 'Hg Test Kit saat ini masih dalam tahap prototipe dan validasi laboratorium sedang direncanakan, jadi kami tidak menyebutkan angka sensitivitas atau akurasi tertentu. Pengujian ini difungsikan sebagai skrining awal mandiri bagi masyarakat.';
      } else if (lower.includes('isi kit') || lower.includes('hg test kit') || lower.includes('beli') || lower.includes('harga')) {
        fallbackReply = 'Hg Test Kit berisi 5 strip kertas uji merkuri, 2 kartu referensi warna, 5 alat ambil sampel sekali pakai, panduan bergambar dan skala warna, serta kode batch MRC-2026-A05 dan QR. Kit ini bisa mengecek satu rangkaian skincare-mu (krim siang, krim malam, toner, serum, sabun). Harga di web merupakan harga simulasi untuk prototipe.';
      } else if (lower.includes('bahaya') || lower.includes('efek') || lower.includes('racun')) {
        fallbackReply = 'Merkuri adalah logam berat berbahaya yang dilarang dalam kosmetik. Pemakaiannya bisa merusak lapisan pelindung kulit, memicu flek hitam yang sulit hilang, serta terserap ke tubuh dan berisiko merusak ginjal serta sistem saraf. Pastikan selalu mengecek nomor izin edar di cekbpom.pom.go.id ya!';
      } else if (lower.includes('halo') || lower.includes('hai') || lower.includes('siapa kamu')) {
        fallbackReply = 'Hai, aku Mercy, asisten MERCURY! Aku bisa bantu soal cara pakai Hg Test Kit, arti hasil tes, dan cara baca Hasil Tes dari komunitas. Mau tanya apa?';
      } else {
        fallbackReply = 'Hai! Mercy fokus membantu skrining awal merkuri dan fitur di MERCURY. Kamu bisa tanya cara pakai Hg Test Kit, arti status hasil seperti Terindikasi, atau cara baca Hasil Tes komunitas. Ada yang ingin kamu tanyakan seputar skrining merkuri?';
      }

      return res.json({ reply: fallbackReply });
    } catch (err: any) {
      console.error('Chat error:', err);
      return res.status(500).json({
        error: 'Terjadi kendala saat memproses respons.',
        fallbackReply: 'Maaf, terjadi kendala saat memproses pertanyaan. Silakan coba kembali atau gunakan menu Scan dan Hasil Tes.'
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'mercury-api', timestamp: new Date().toISOString() });
  });

  // Mount Vite in dev or serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`MERCURY Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
