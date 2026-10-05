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

  // Knowledge System Instruction for MERCURY Chatbot
  const SYSTEM_INSTRUCTION = `Anda adalah "Merqi", asisten AI resmi dari MERCURY (Platform Skrining Merkuri Kosmetik & Basis Data Komunitas Terbuka).
Karakter: Ramah, empatik, edukatif, ilmiah namun mudah dipahami masyarakat awam, dan sangat peduli terhadap kesehatan kulit dan perlindungan konsumen.
Bahasa: Bahasa Indonesia yang natural, hangat, dan profesional.

Tugas dan Pengetahuan Utama:
1. Cara Kerja Kit Kertas Uji Kolorimetri MERCURY:
   - Ambil sampel krim/lotion secukupnya (seukuran biji jagung).
   - Oleskan secara merata pada zona uji (lingkaran tengah) kertas reagen MERCURY.
   - Diamkan selama 1-2 menit hingga reagen bereaksi dengan kemungkinan ion merkuri (Hg²⁺).
   - Buka menu "Scan Kertas Uji" di aplikasi MERCURY, arahkan kamera tegak lurus dengan pencahayaan cukup agar 4 target kalibrasi warna terdeteksi.
   - Aplikasi akan melakukan normalisasi RGB terhadap target referensi dan menghitung nilai pergeseran kroma (ΔE) serta perkiraan rentang kadar merkuri (ppm).

2. Bahaya Merkuri (Hg) pada Kosmetik:
   - Merkuri sering disalahgunakan dalam krim pemutih instan ilegal karena menghambat enzim tirosinase sehingga produksi pigmen melanin terhenti secara paksa.
   - Bahaya jangka pendek: iritasi kulit, rasa panas/terbakar, kemerahan, kulit menipis, timbul jerawat parah saat berhenti, dan hiperpigmentasi rebound (flek hitam memburuk).
   - Bahaya jangka panjang: merkuri diserap ke aliran darah, merusak ginjal (proteinuria, gagal ginjal), kerusakan sistem saraf pusat (tremor, insomnia, kecemasan, hilang ingatan), dan bagi ibu hamil dapat menembus plasenta memicu mikrosefali serta cacat permanen pada janin.
   - Batas aman BPOM & WHO: Kadar merkuri pada kosmetik TIDAK BOLEH melebihi 1 ppm (1 mg/kg) atau dilarang sengaja ditambahkan (0%).

3. Ciri-ciri Kosmetik yang Patut Dicurigai Mengandung Merkuri:
   - Tekstur lengket, tidak rata, atau memisah antara minyak dan padatan jika didiamkan.
   - Warna putih mengkilap seperti mutiara (pearlescent) atau kuning mencolok tanpa izin BPOM.
   - Berbau logam menyengat atau parfum sangat tajam untuk menyamarkan bau logam.
   - Janji hasil tidak masuk akal: "Putih glowing instan dalam 3-7 hari".
   - Tidak ada nomor notifikasi BPOM resmi (format NA/NB/NC/ND diikuti 11 digit angka), komposisi lengkap, atau nama produsen yang jelas.

4. Verifikasi BPOM Resmi:
   - Konsumen disarankan mengecek nomor izin edar di cekbpom.pom.go.id atau aplikasi BPOM Mobile.

5. Fitur Aplikasi MERCURY:
   - Beranda: Edukasi, statistik, dan pencarian cepat.
   - Scan Kertas Uji: Skrining otomatis kertas reagen kit MERCURY & kertas mandiri.
   - Basis Data: Direktori terbuka hasil tes komunitas.
   - Toko Kit Uji: Pemesanan kit strip uji resmi (Starter Kit, Family Safety Pack, Bulk Lab Pack).
   - Akun: Menyimpan riwayat tes pribadi dan status pesanan.

Pedoman Menjawab:
- Berikan jawaban yang terstruktur, rapi, dan mudah dibaca (gunakan bullet points jika perlu).
- Selalu ingatkan bahwa skrining kolorimetri adalah deteksi dini berbasis presisi visual/kimia lapangan, sedangkan pengujian definitif hukum dilakukan oleh laboratorium BPOM dengan spektrometri AAS/ICP-MS.
- Jangan berikan resep obat medis, sarankan konsultasi ke dokter spesialis kulit (Sp.DVE) jika ada keluhan alergi/iritasi parah.`;

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
            model: 'gemini-3.8-flash',
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

      // Offline / Intelligent fallback response when key is pending
      const lower = message.toLowerCase();
      let fallbackReply = '';

      if (lower.includes('cara pakai') || lower.includes('cara guna') || lower.includes('cara menguji') || lower.includes('cara test') || lower.includes('cara tes')) {
        fallbackReply = `Berikut langkah mudah menguji kosmetik dengan Kit Uji MERCURY:\n\n1. **Siapkan Kertas Uji**: Letakkan kertas reagen MERCURY di area datar dengan pencahayaan cukup.\n2. **Oleskan Sampel**: Ambil krim/lotion secukupnya (seukuran biji jagung) lalu oleskan merata pada lingkaran reagen di bagian tengah.\n3. **Tunggu Reaksi**: Diamkan selama 1-2 menit agar reagen bereaksi dengan kemungkinan ion merkuri (Hg²⁺).\n4. **Buka Menu Scan**: Arahkan kamera aplikasi MERCURY tegak lurus sehingga 4 target kalibrasi warna terdeteksi.\n5. **Hasil Otomatis**: Aplikasi membaca pergeseran warna (ΔE), menghitung perkiraan kadar ppm merkuri, dan menampilkan status keamanannya.`;
      } else if (lower.includes('bahaya') || lower.includes('efek') || lower.includes('racun') || lower.includes('rusak') || lower.includes('dampak')) {
        fallbackReply = `Merkuri (Hg) adalah logam berat beracun yang dilarang keras dalam kosmetik. Berikut bahaya utamanya:\n\n• **Pada Kulit**: Mengikis pelindung kulit (*skin barrier*), sensasi panas perih, alergi parah, dan memicu *ochronosis* (flek hitam permanen akibat kerusakan sel melanosit).\n• **Pada Ginjal & Saraf**: Merkuri terserap pori-pori menuju darah, merusak tubulus ginjal (*nefrotoksisitas*), serta mengganggu saraf pusat (tremor, insomnia, depresi).\n• **Pada Ibu Hamil & Janin**: Merkuri menembus plasenta dan barrier darah-otak janin, berisiko menyebabkan mikrosefali dan cacat fisik bawaan.\n\nSesuai standar BPOM dan WHO, batas toleransi kontaminan kosmetik adalah di bawah 1 ppm.`;
      } else if (lower.includes('ciri') || lower.includes('tanda') || lower.includes('krim abal') || lower.includes('warna krim') || lower.includes('tekstur')) {
        fallbackReply = `Ciri-ciri kosmetik yang patut dicurigai mengandung merkuri:\n\n1. **Warna Mengkilap Tak Alami**: Berwarna putih mengkilat mutiara (*pearlescent*) atau kuning terang mencolok.\n2. **Tekstur Lengket / Memisah**: Krim terasa lengket, kasar/berbutir, dan minyak terpisah jika disimpan beberapa hari.\n3. **Bau Logam Kuat**: Tercium aroma logam khas, terkadang disamarkan dengan wangi parfum kimia yang sangat tajam.\n4. **Klaim Putih Kilat**: Menjanjikan kulit putih seketika dalam 3-7 hari.\n5. **Izin BPOM Fiktif / Tidak Ada**: Tidak memiliki nomor notifikasi resmi BPOM (format NA diikuti 11 digit angka) yang terdaftar di cekbpom.pom.go.id.`;
      } else if (lower.includes('bpom') || lower.includes('izin') || lower.includes('legal') || lower.includes('asli')) {
        fallbackReply = `Untuk memastikan keamanan dan izin edar produk kosmetik Anda:\n\n1. Cari nomor **Notifikasi BPOM** pada label atau kemasan (contoh: **NA18230101234**).\n2. Buka situs resmi **[cekbpom.pom.go.id](https://cekbpom.pom.go.id)** atau unduh aplikasi **BPOM Mobile**.\n3. Masukkan nomor notifikasi atau nama merek. Pastikan status izin aktif dan nama pendaftar sesuai dengan kemasan asli.\n4. Anda juga dapat memeriksa riwayat uji independen komunitas di menu **Basis Data** aplikasi MERCURY.`;
      } else if (lower.includes('beli') || lower.includes('order') || lower.includes('pesan') || lower.includes('harga') || lower.includes('toko') || lower.includes('kit')) {
        fallbackReply = `Anda dapat memesan kit kertas uji resmi langsung di menu **Toko Kit Uji** aplikasi MERCURY:\n\n• **Starter Kit Konsumen** (5 strip uji + kartu kalibrasi): Ideal untuk cek skincare pribadi.\n• **Family Safety Pack** (15 strip uji): Pilihan hemat untuk perlindungan keluarga.\n• **Lab & Educator Bulk Pack** (50 strip uji): Dirancang untuk pengujian berkala dan komunitas.\n\nSetiap strip dilengkapi reagen kolorimetri terstandarisasi dan target kalibrasi RGB presisi tinggi.`;
      } else if (lower.includes('halo') || lower.includes('hai') || lower.includes('siapa') || lower.includes('selamat')) {
        fallbackReply = `Halo! Saya **Merqi**, asisten virtual cerdas MERCURY. 👋🔬\n\nSaya siap membantu Anda seputar:\n• Panduan penggunaan kit uji kertas kolorimetri MERCURY\n• Bahaya dan ciri-ciri kosmetik bermerkuri\n• Cara verifikasi izin BPOM resmi\n• Penjelasan hasil scan dan status keamanan produk\n\nAda yang ingin Anda tanyakan seputar keamanan kosmetik hari ini?`;
      } else {
        fallbackReply = `Terima kasih atas pertanyaannya! Sebagai asisten skrining kosmetik MERCURY, saya dapat membantu Anda:\n\n1. Memandu cara menguji sampel krim di menu **Scan Kertas Uji**.\n2. Mengecek apakah produk Anda sudah pernah diuji teman komunitas di menu **Basis Data**.\n3. Menjelaskan ciri-ciri kosmetik berbahaya dan cara cek izin resmi BPOM.\n\nSilakan tanyakan hal spesifik seperti: *\"Bagaimana cara pakai kit uji?\"*, *\"Apa bahaya merkuri?\"*, atau *\"Ciri-ciri krim bermerkuri?\"*.`;
      }

      return res.json({ reply: fallbackReply });
    } catch (err: any) {
      console.error('Chat error:', err);
      return res.status(500).json({
        error: 'Terjadi kendala saat memproses respons.',
        fallbackReply: 'Maaf, terjadi kendala saat memproses pertanyaan. Anda dapat mengecek menu Scan atau Basis Data untuk informasi lebih lanjut.'
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
