import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Building, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { UserAccount } from '../../types';
import { INITIAL_USERS, getInitials, generateMemberId } from '../../data/mockUsers';
import { MercuryMascot } from '../illustrations/MercuryMascot';

interface AuthFormProps {
  onSuccess: (user: UserAccount, message: string) => void;
  initialMode?: 'login' | 'register';
  compact?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  onSuccess,
  initialMode = 'login',
  compact = false
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCity, setRegCity] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Helper to get registered users from localStorage
  const getStoredUsers = (): UserAccount[] => {
    try {
      const stored = localStorage.getItem('mercury_users_db');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading stored users:', e);
    }
    return INITIAL_USERS;
  };

  const saveStoredUsers = (users: UserAccount[]) => {
    try {
      localStorage.setItem('mercury_users_db', JSON.stringify(users));
    } catch (e) {
      console.warn('Error saving users to storage:', e);
    }
  };

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailTrim = loginEmail.trim().toLowerCase();
    const passTrim = loginPassword.trim();

    if (!emailTrim || !passTrim) {
      setErrorMessage('Mohon isi alamat email dan kata sandi.');
      return;
    }

    const users = getStoredUsers();
    const matched = users.find(u => u.email.toLowerCase() === emailTrim);

    if (!matched) {
      setErrorMessage('Email tidak terdaftar. Yuk daftar akun baru dulu!');
      return;
    }

    if (matched.password && matched.password !== passTrim) {
      setErrorMessage('Kata sandi yang kamu masukkan keliru. Silakan coba lagi.');
      return;
    }

    setSuccessMessage(`Berhasil masuk! Selamat datang, ${matched.name}.`);
    setTimeout(() => {
      onSuccess(matched, `Selamat datang, ${matched.name}!`);
    }, 400);
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const nameTrim = regName.trim();
    const emailTrim = regEmail.trim().toLowerCase();
    const passTrim = regPassword.trim();

    if (!nameTrim) {
      setErrorMessage('Mohon isi nama lengkap kamu.');
      return;
    }

    if (!emailTrim || !emailTrim.includes('@')) {
      setErrorMessage('Mohon masukkan alamat email yang valid.');
      return;
    }

    if (passTrim.length < 6) {
      setErrorMessage('Kata sandi minimal harus 6 karakter agar akunmu aman.');
      return;
    }

    if (passTrim !== regConfirmPassword.trim()) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Mohon setujui komitmen transparansi komunitas.');
      return;
    }

    const users = getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === emailTrim);
    if (existing) {
      setErrorMessage('Email ini sudah terdaftar. Silakan pilih tab "Masuk".');
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: nameTrim,
      email: emailTrim,
      password: passTrim,
      city: regCity.trim() || undefined,
      initials: getInitials(nameTrim),
      memberId: generateMemberId(),
      joinDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      testsCount: 0,
      bio: 'Anggota komunitas peduli skincare aman MERCURY.'
    };

    const updatedUsers = [...users, newUser];
    saveStoredUsers(updatedUsers);

    setSuccessMessage(`Akun baru berhasil dibuat! Selamat bergabung, ${newUser.name}.`);
    setTimeout(() => {
      onSuccess(newUser, `Pendaftaran berhasil! Selamat datang, ${newUser.name}`);
    }, 600);
  };

  return (
    <div className={`w-full ${compact ? 'max-w-md' : 'max-w-lg'} mx-auto`}>
      
      {/* Tab Switcher: Masuk vs Daftar */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            mode === 'login'
              ? 'bg-white text-[#0F4C5C] shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Masuk ke Akun
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            mode === 'register'
              ? 'bg-white text-[#0F4C5C] shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Daftar Akun Baru
        </button>
      </div>

      {/* Alert Error / Success Messages */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200/80 flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span className="font-semibold leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-800 animate-fadeIn">
          <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
          <span className="font-semibold leading-relaxed">{successMessage}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 1: LOGIN (MASUK) */}
      {/* ===================================================================== */}
      {mode === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>Alamat Email</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                required
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Tampilkan kata sandi"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#0F4C5C] rounded border-slate-300 focus:ring-[#0F4C5C]"
              />
              <span>Ingat saya di perangkat ini</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#0F4C5C] hover:bg-[#166479] text-white text-sm font-extrabold shadow-md shadow-[#0F4C5C]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight size={16} />
          </button>
        </form>
      )}

      {/* ===================================================================== */}
      {/* MODE 2: REGISTER (DAFTAR BARU) */}
      {/* ===================================================================== */}
      {mode === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Contoh: Zazkia Laili"
                required
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="emailmu@domain.com"
                required
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15 transition-all"
              />
            </div>
          </div>

          {/* Kota Domisili (Opsional) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Kota Domisili (Opsional)</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={regCity}
                onChange={(e) => setRegCity(e.target.value)}
                placeholder="Contoh: Jakarta / Bandung / Surabaya"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  required
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Ulangi Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang sandi"
                  required
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F4C5C] focus:ring-2 focus:ring-[#0F4C5C]/15 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-[#0F4C5C] rounded border-slate-300 focus:ring-[#0F4C5C]"
              />
              <span>
                Saya berkomitmen berkontribusi secara objektif dan jujur demi mewujudkan kosmetik bebas merkuri di Indonesia.
              </span>
            </label>
          </div>

          {/* Submit Register */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-2xl bg-[#E8837A] hover:bg-[#D96F65] text-white text-sm font-extrabold shadow-md shadow-[#E8837A]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Daftar Akun Baru</span>
            <ArrowRight size={16} />
          </button>

        </form>
      )}

    </div>
  );
};
