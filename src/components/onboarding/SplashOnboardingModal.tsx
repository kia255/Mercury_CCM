import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Camera, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  FlaskConical, 
  Users,
  UserPlus,
  LogIn
} from 'lucide-react';
import { MercuryLogo } from '../common/MercuryLogo';
import { motion, AnimatePresence } from 'motion/react';

interface SplashOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectToRegister: () => void;
  onDirectToLogin: () => void;
  forceStage?: 'splash' | 'onboarding';
}

export const SplashOnboardingModal: React.FC<SplashOnboardingModalProps> = ({
  isOpen,
  onClose,
  onDirectToRegister,
  onDirectToLogin,
  forceStage
}) => {
  const [stage, setStage] = useState<'splash' | 'onboarding'>('splash');
  const [progress, setProgress] = useState<number>(0);

  // Reset stage when opened
  useEffect(() => {
    if (isOpen) {
      setStage(forceStage || 'splash');
      setProgress(0);
    }
  }, [isOpen, forceStage]);

  // Handle splash progress and auto-transition to onboarding
  useEffect(() => {
    if (!isOpen || stage !== 'splash') return;

    const startTime = Date.now();
    const duration = 2400; // 2.4 seconds splash duration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        setStage('onboarding');
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isOpen, stage]);

  if (!isOpen) return null;

  const handleFinishOnboardingToRegister = () => {
    try {
      localStorage.setItem('mercury_has_seen_intro', 'true');
    } catch (e) {
      console.warn('Gagal menyimpan intro state:', e);
    }
    onClose();
    onDirectToRegister();
  };

  const handleFinishOnboardingToLogin = () => {
    try {
      localStorage.setItem('mercury_has_seen_intro', 'true');
    } catch (e) {
      console.warn('Gagal menyimpan intro state:', e);
    }
    onClose();
    onDirectToLogin();
  };

  const handleSkipOrClose = () => {
    try {
      localStorage.setItem('mercury_has_seen_intro', 'true');
    } catch (e) {
      console.warn('Gagal menyimpan intro state:', e);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/80 backdrop-blur-md">
      <AnimatePresence mode="wait">
        {stage === 'splash' ? (
          /* =================================================================
             1. SPLASH SCREEN (MERCURY APPLICATION SPLASH)
             ================================================================= */
          <motion.div
            key="splash-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-10 bg-gradient-to-b from-[#0B3A46] via-[#0F4C5C] to-[#0A2F3A] text-white select-none overflow-hidden"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#E8837A]/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar: Close / Skip button */}
            <div className="w-full max-w-md flex items-center justify-between z-10 pt-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-teal-200/80 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                MERCURY Mobile App
              </span>
              <button
                onClick={() => setStage('onboarding')}
                className="text-xs font-semibold text-teal-100 hover:text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md border border-white/15"
              >
                Lewati &rsaquo;
              </button>
            </div>

            {/* Center: Brand Identity & Animated Splash */}
            <div className="flex flex-col items-center text-center space-y-6 max-w-sm z-10 my-auto">
              <motion.div 
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative"
              >
                {/* Glow ring */}
                <div className="absolute -inset-4 bg-teal-300/25 rounded-3xl blur-xl animate-pulse" />
                
                <div className="relative p-6 bg-white rounded-3xl shadow-2xl border-2 border-white/90">
                  <MercuryLogo variant="full" size={62} />
                </div>
              </motion.div>

              <div className="space-y-2">
                <motion.h1 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-2xl sm:text-3xl font-black tracking-tight text-white"
                >
                  MERCURY
                </motion.h1>
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-xs sm:text-sm font-medium text-teal-100/90 leading-relaxed"
                >
                  Platform Skrining Terbuka Merkuri Skincare
                </motion.p>
              </div>

              {/* Tag badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex items-center gap-2 text-[11px] font-semibold text-teal-200/90"
              >
                <span>Cepat</span>
                <span>•</span>
                <span>Mandiri</span>
                <span>•</span>
                <span>Komunitas</span>
              </motion.div>
            </div>

            {/* Bottom: Progress Bar & Version */}
            <div className="w-full max-w-xs space-y-3 z-10 pb-4 text-center">
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden backdrop-blur-md">
                <div 
                  className="h-full bg-gradient-to-r from-teal-300 to-[#E8837A] rounded-full transition-all duration-75 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-teal-200/70 font-medium">
                Memuat aplikasi...
              </p>
            </div>
          </motion.div>
        ) : (
          /* =================================================================
             2. ONBOARDING SCREEN (1 SCREEN ONBOARDING)
             ================================================================= */
          <motion.div
            key="onboarding-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative w-full max-w-lg mx-3 sm:mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 my-4 max-h-[92vh] flex flex-col"
          >
            {/* Close Button at Top Right */}
            <button
              onClick={handleSkipOrClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup Onboarding"
              title="Tutup"
            >
              <X size={20} />
            </button>

            {/* Header Banner */}
            <div className="relative bg-gradient-to-br from-[#0F4C5C] to-[#166072] text-white p-6 sm:p-7 pb-8 text-center space-y-3 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#E8837A]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="inline-flex p-2.5 bg-white rounded-2xl shadow-md mx-auto">
                <MercuryLogo variant="full" size={38} />
              </div>

              <div className="space-y-1 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-[11px] font-bold border border-white/20 mb-1">
                  <Sparkles size={12} className="text-[#E8837A]" />
                  <span>Pengenalan Aplikasi</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  Selamat Datang di MERCURY!
                </h2>
                <p className="text-xs sm:text-sm text-teal-100/90 font-medium max-w-sm mx-auto">
                  Aplikasi skrining mandiri merkuri skincare untuk konsumen cerdas dan komunitas yang saling menjaga.
                </p>
              </div>
            </div>

            {/* Body: 3 Simple Steps & Feature Highlights */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-3">
                {/* Feature 1 */}
                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-teal-50/60 border border-teal-100">
                  <div className="w-10 h-10 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FlaskConical size={20} className="text-teal-200" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
                      1. Uji Mandiri dengan Kertas Uji
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      Teteskan sedikit skincare ke strip uji merkuri. Perubahan warna menunjukkan indikasi awal kandungan merkuri.
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-rose-50/60 border border-rose-100">
                  <div className="w-10 h-10 rounded-xl bg-[#E8837A] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Camera size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
                      2. Foto & Scan Otomatis
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      Arahkan kamera ke kertas uji dan kartu referensi. Sistem otomatis menganalisis warna dan memberikan interpretasi awal.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Users size={20} className="text-teal-200" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
                      3. Komunitas Terbuka & Saling Menjaga
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      Simpan riwayat pengujian produk Anda dan akses Hasil Tes dari komunitas sebelum memutuskan checkout produk kosmetik.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/80 text-[11px] text-slate-600 font-medium justify-center text-center">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>100% Gratis untuk Scan & Lihat Hasil • Skrining awal mandiri</span>
              </div>
            </div>

            {/* Bottom Footer Actions (Directs directly to Create Account) */}
            <div className="p-5 sm:p-6 pt-3 bg-slate-50/80 border-t border-slate-200/80 space-y-2.5">
              {/* PRIMARY CTA: Directs to Create Account */}
              <button
                onClick={handleFinishOnboardingToRegister}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#0F4C5C] hover:bg-[#0B3A46] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#0F4C5C]/25 transition-all transform active:scale-98 cursor-pointer"
              >
                <UserPlus size={18} />
                <span>Lanjut Buat Akun MERCURY</span>
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center justify-between pt-1 text-xs">
                {/* Secondary Option: Sudah punya akun? Masuk */}
                <button
                  onClick={handleFinishOnboardingToLogin}
                  className="font-bold text-[#0F4C5C] hover:underline cursor-pointer flex items-center gap-1 py-1"
                >
                  <LogIn size={13} />
                  <span>Sudah punya akun? Masuk</span>
                </button>

                {/* Secondary Option: Jelajahi dulu */}
                <button
                  onClick={handleSkipOrClose}
                  className="font-medium text-slate-500 hover:text-slate-800 cursor-pointer py-1"
                >
                  Jelajahi Dulu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
