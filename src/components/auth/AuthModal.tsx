import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { UserAccount } from '../../types';
import { AuthForm } from './AuthForm';
import { MercuryLogo } from '../common/MercuryLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount, message: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 my-6 animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex justify-center">
            <MercuryLogo variant="full" size={44} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              {initialMode === 'register' ? 'Buat Akun MERCURY' : 'Selamat Datang Kembali'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Platform skrining terbuka untuk konsumen cerdas & komunitas peduli kosmetik aman.
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <AuthForm
          initialMode={initialMode}
          onSuccess={(user, message) => {
            onSuccess(user, message);
            onClose();
          }}
        />

      </div>
    </div>
  );
};
