import React, { useState, useEffect, useRef } from 'react';
import { UserWallet, GiftItem, Streamer } from '../types';
import { GIFTS_CATALOG } from '../data/gifts';
import { Video, Mic, MicOff, VideoOff, Sparkles, Radio, Users, Gem, Gift, Send, Play, X, ShieldAlert } from 'lucide-react';

interface UserLiveBroadcasterProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  onSimulateIncomingGift: (gift: GiftItem, fanName: string, quantity: number) => void;
  onUpdateWallet: (newWallet: UserWallet) => void;
}

export const UserLiveBroadcaster: React.FC<UserLiveBroadcasterProps> = ({
  isOpen,
  onClose,
  wallet,
  onSimulateIncomingGift,
  onUpdateWallet
}) => {
  const [streamTitle, setStreamTitle] = useState('🔥 charlando y jugando en vivo | envia regalos para cantar');
  const [category, setCategory] = useState<'Gaming' | 'Música' | 'Charla' | 'ASMR' | 'Cocina'>('Charla');
  const [goalTitle, setGoalTitle] = useState('Meta: Cohete Espacial 🚀');
  const [goalTarget, setGoalTarget] = useState(1000);
  const [isLiveActive, setIsLiveActive] = useState(false);

  // Camera & Mic States
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stats during active stream
  const [liveViewers, setLiveViewers] = useState(128);
  const [liveDiamonds, setLiveDiamonds] = useState(0);
  const [simFanName, setSimFanName] = useState('Fan_VIP_Gamer');
  const [selectedSimGift, setSelectedSimGift] = useState<GiftItem>(GIFTS_CATALOG[0]);
  const [simQty, setSimQty] = useState(1);

  // Camera initialization
  useEffect(() => {
    if (isOpen && isVideoOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.log('Camera permission optional/not available, showing video canvas background:', err);
        });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, isVideoOn]);

  // Viewer fluctuation interval when live
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      setLiveViewers(prev => Math.max(10, prev + Math.floor(Math.random() * 9) - 4));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  if (!isOpen) return null;

  const handleStartLive = async () => {
    try {
      const res = await fetch('/api/streamers/go-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: streamTitle,
          category,
          goalTitle,
          goalCoins: goalTarget
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsLiveActive(true);
      }
    } catch (e) {
      setIsLiveActive(true);
    }
  };

  const handleTriggerSimulatedFanGift = () => {
    if (!selectedSimGift) return;
    const earnedDiamonds = Math.floor(selectedSimGift.coinPrice * simQty * 0.5);
    setLiveDiamonds(prev => prev + earnedDiamonds);

    onSimulateIncomingGift(selectedSimGift, simFanName, simQty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-xl bg-stone-950/90 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-stone-900/80 backdrop-blur-md px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-600/20 rounded-xl border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-wide">Estudio de Transmisión en Vivo</h2>
              <p className="text-[11px] text-stone-400 font-medium">Emite en directo y recibe regalos monetizables</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white font-bold p-1 text-xl transition-all"
          >
            ✕
          </button>
        </div>

        {/* Camera / Video Viewport Area */}
        <div className="relative w-full h-64 bg-gradient-to-br from-purple-950 via-stone-900 to-black overflow-hidden flex items-center justify-center border-b border-white/10">
          {isVideoOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 text-stone-500">
              <VideoOff className="w-12 h-12" />
              <span className="text-xs font-extrabold">Cámara Apagada</span>
            </div>
          )}

          {/* Live Overlay Badges */}
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            {isLiveActive ? (
              <div className="bg-rose-600 text-white font-black text-[11px] px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>EN VIVO</span>
              </div>
            ) : (
              <div className="bg-stone-900/80 backdrop-blur-md text-stone-300 font-extrabold text-[11px] px-3 py-1 rounded-full border border-white/10">
                Vista Previa
              </div>
            )}

            {isLiveActive && (
              <div className="bg-black/70 backdrop-blur-md text-white font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center space-x-1 border border-white/10">
                <Users className="w-3.5 h-3.5 text-rose-400" />
                <span>{liveViewers}</span>
              </div>
            )}
          </div>

          {/* Live Diamond Earnings Counter during stream */}
          {isLiveActive && (
            <div className="absolute top-3 right-3 bg-purple-950/90 border border-purple-500/60 text-purple-200 font-black text-xs px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)] backdrop-blur-md">
              <Gem className="w-4 h-4 text-purple-400 fill-purple-400" />
              <span>+{liveDiamonds.toLocaleString()} 💎 Ganados</span>
            </div>
          )}

          {/* Camera Controls Overlay */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-2">
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all active:scale-95"
            >
              {isVideoOn ? <Video className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all active:scale-95"
            >
              {isAudioOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-rose-400" />}
            </button>
          </div>
        </div>

        {/* Content Controls & Configuration */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-80 text-xs">
          {!isLiveActive ? (
            /* Setup Phase */
            <div className="space-y-3">
              <div>
                <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">
                  Título de la Transmisión
                </label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={e => setStreamTitle(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 font-bold text-white focus:outline-none focus:border-rose-500"
                  placeholder="Escribe un título llamativo..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 font-bold text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Charla">💬 Charla / Just Chatting</option>
                    <option value="Gaming">🎮 Gaming</option>
                    <option value="Música">🎸 Música en Vivo</option>
                    <option value="ASMR">🎧 ASMR & Chill</option>
                    <option value="Cocina">🍕 Cocina & Recetas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">
                    Meta de Monedas en LIVE
                  </label>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={e => setGoalTarget(parseInt(e.target.value) || 500)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 font-bold text-yellow-400 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <button
                onClick={handleStartLive}
                className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-sm py-3.5 rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>INICIAR TRANSMISIÓN EN VIVO AHORA</span>
              </button>
            </div>
          ) : (
            /* Active Live Broadcaster Dashboard */
            <div className="space-y-4">
              <div className="bg-purple-950/40 border border-purple-800/50 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-purple-300">Monetización del Live en Vivo</div>
                  <div className="text-base font-black text-white flex items-center space-x-1.5 mt-0.5">
                    <Gem className="w-4 h-4 text-purple-400 fill-purple-400" />
                    <span>{liveDiamonds.toLocaleString()} Diamantes = ${(liveDiamonds * 0.005).toFixed(2)} USD</span>
                  </div>
                </div>
                <div className="text-right text-[11px] font-bold text-yellow-400">
                  Meta: {goalTarget} 🪙
                </div>
              </div>

              {/* Real-time Received Gifts Activity Stream */}
              <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between text-rose-400 font-extrabold text-xs">
                  <span className="flex items-center space-x-1.5">
                    <Gift className="w-4 h-4" />
                    <span>Regalos Recibidos de Espectadores</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800 font-mono">
                    EN VIVO
                  </span>
                </div>
                
                <p className="text-[11px] text-stone-400">
                  Los espectadores que se unan a tu directo enviarán regalos virtuales en tiempo real. ¡Aparecerán aquí y en tu pantalla!
                </p>

                <div className="bg-stone-950 border border-white/5 rounded-xl p-3 text-xs space-y-2 max-h-32 overflow-y-auto">
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="font-bold text-white flex items-center space-x-1.5">
                      <span>🌸 Ana_Gamer</span>
                      <span className="text-stone-400 text-[10px]">te envió</span>
                      <span className="text-yellow-400 font-black">🌹 Rosa x5</span>
                    </span>
                    <span className="text-[10px] text-purple-300 font-bold">+50 💎</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-300">
                    <span className="font-bold text-white flex items-center space-x-1.5">
                      <span>🚀 Carlos_VIP</span>
                      <span className="text-stone-400 text-[10px]">te envió</span>
                      <span className="text-yellow-400 font-black">🚀 Cohete TikTok</span>
                    </span>
                    <span className="text-[10px] text-purple-300 font-bold">+10,000 💎</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsLiveActive(false)}
                className="w-full bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-200 font-black text-xs py-3 rounded-2xl transition-all shadow-md active:scale-95"
              >
                Finalizar Transmisión en Vivo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
