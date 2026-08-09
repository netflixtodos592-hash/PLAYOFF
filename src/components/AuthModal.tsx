import React, { useState } from 'react';
import { Mail, Lock, User, CheckCircle2, LogIn, UserPlus, Sparkles, LogOut } from 'lucide-react';

export interface UserAccount {
  email: string;
  displayName: string;
  avatar: string;
  coins: number;
  diamonds: number;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    const formattedName = displayName.trim() || email.split('@')[0];
    const newAccount: UserAccount = {
      email: email.trim().toLowerCase(),
      displayName: formattedName,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      coins: currentUser.coins || 1000,
      diamonds: currentUser.diamonds || 0,
    };

    onLogin(newAccount);
    setSuccessMsg(isRegistering ? '¡Cuenta creada con éxito!' : '¡Sesión iniciada con éxito!');

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1200);
  };

  const presetAccounts: UserAccount[] = [
    {
      email: 'creador.maria@gmail.com',
      displayName: 'María Creadora 🌸',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      coins: 2500,
      diamonds: 850,
    },
    {
      email: 'alex.gaming@gmail.com',
      displayName: 'Alex Streamer 🎮',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      coins: 5000,
      diamonds: 1400,
    },
    {
      email: 'usuario.fan@gmail.com',
      displayName: 'Usuario Fan #1 ⭐',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      coins: 800,
      diamonds: 120,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-md bg-stone-900/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 text-white shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-600/20 rounded-2xl border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Mail className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">
                {currentUser.email ? 'Mi Cuenta de Usuario' : isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </h2>
              <p className="text-xs text-stone-400 font-medium">Ingresa con tu correo electrónico personal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-xl font-bold p-1 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Current Active Account Card */}
        {currentUser.email && (
          <div className="my-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-white/10 p-4 rounded-2xl flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-12 h-12 rounded-full object-cover border-2 border-rose-500 shadow-md"
              />
              <div>
                <div className="text-sm font-black text-white">{currentUser.displayName}</div>
                <div className="text-xs text-stone-400 font-mono">{currentUser.email}</div>
                <div className="text-[10px] text-yellow-400 font-bold mt-0.5">
                  Saldo: {currentUser.coins} Monedas | {currentUser.diamonds} 💎
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                setSuccessMsg('Sesión cerrada correctamente.');
                setTimeout(() => setSuccessMsg(null), 1500);
              }}
              className="p-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-xl border border-rose-800 transition-all flex items-center space-x-1 text-xs font-bold"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Alert Message */}
        {successMsg && (
          <div className="my-3 bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 p-3 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form for Login or Registration */}
        <form onSubmit={handleSubmit} className="mt-3 space-y-3.5">
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Nombre Completo o Nombre de Usuario</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ej. Sofía Martinez 🌸"
                  className="w-full bg-stone-950 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full bg-stone-950 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-xs py-3 rounded-2xl shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            {isRegistering ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{isRegistering ? 'Crear Cuenta e Ingresar' : 'Entrar con mi Correo'}</span>
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-rose-400 hover:underline font-bold"
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate gratis'}
          </button>
        </div>

        {/* Quick Switch Demo Accounts */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>O elige una cuenta demo rápida:</span>
          </div>

          <div className="space-y-2">
            {presetAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => {
                  onLogin(acc);
                  setEmail(acc.email);
                  setSuccessMsg(`Sesión iniciada como ${acc.displayName}`);
                  setTimeout(() => {
                    setSuccessMsg(null);
                    onClose();
                  }, 1000);
                }}
                className="w-full p-2 rounded-xl bg-stone-950/60 hover:bg-stone-800 border border-white/5 hover:border-white/20 flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center space-x-2">
                  <img src={acc.avatar} alt={acc.displayName} className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-bold text-white">{acc.displayName}</div>
                    <div className="text-[10px] text-stone-400">{acc.email}</div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-yellow-400">{acc.coins} 🪙</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
