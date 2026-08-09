import React, { useState } from 'react';
import { Streamer } from '../types';
import { Play, Heart, MessageCircle, Share2, Radio, Sparkles, Plus, Film } from 'lucide-react';

export interface ShortItem {
  id: string;
  title: string;
  likes: string;
  comments: string;
  videoUrl?: string;
  streamer: {
    username: string;
    displayName: string;
    avatar: string;
    streamBgGradient?: string;
    id?: string;
  };
}

interface ShortsFeedProps {
  streamers: Streamer[];
  customShorts?: ShortItem[];
  onSelectStream: (streamer: Streamer) => void;
  onOpenUploadModal: () => void;
}

export const ShortsFeed: React.FC<ShortsFeedProps> = ({
  streamers,
  customShorts = [],
  onSelectStream,
  onOpenUploadModal,
}) => {
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  const defaultShorts: ShortItem[] = [
    {
      id: 'short-1',
      title: '¡Mira los regalos más increíbles del LIVE de ayer! 🚀🔥 #LiveStream #Gifts #Creadores',
      likes: '142.5k',
      comments: '1,240',
      streamer: streamers[0] || {
        username: 'sofi_live',
        displayName: 'Sofi Gaming 🎮',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        streamBgGradient: 'from-violet-900 via-purple-900 to-indigo-950'
      }
    },
    {
      id: 'short-2',
      title: 'Acústico improvisado de medianoche 🎸 ¡Envíame tu canción favorita en vivo!',
      likes: '89.2k',
      comments: '840',
      streamer: streamers[1] || {
        username: 'carlos_music',
        displayName: 'Carlos Guitarras 🎸',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        streamBgGradient: 'from-rose-950 via-pink-900 to-slate-950'
      }
    },
    {
      id: 'short-3',
      title: 'Sonidos relajantes para dormir profundo 🎧 ASMR binaural de alta calidad',
      likes: '210.1k',
      comments: '3,100',
      streamer: streamers[2] || {
        username: 'valen_asmr',
        displayName: 'Valen ASMR & Chill 💤',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        streamBgGradient: 'from-cyan-950 via-teal-900 to-slate-950'
      }
    }
  ];

  const allShorts = [...customShorts, ...defaultShorts];
  const currentShort = allShorts[activeVideoIdx] || allShorts[0];

  return (
    <div className="relative w-full h-[calc(100vh-112px)] max-w-md mx-auto bg-stone-950 text-white overflow-hidden flex flex-col justify-between select-none shadow-2xl border-x border-stone-800/80">
      {/* Video element or gradient background */}
      {currentShort.videoUrl ? (
        <video
          src={currentShort.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-tr ${currentShort.streamer.streamBgGradient || 'from-purple-950 to-black'} opacity-90`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-20 h-20 text-white/30 animate-pulse drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
          </div>
        </div>
      )}

      {/* Top Banner overlay */}
      <div className="relative z-10 p-3.5 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <div className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center space-x-1 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Para Ti</span>
        </div>

        {/* Upload Video Button & Live Launcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenUploadModal}
            className="bg-stone-900/90 hover:bg-stone-800 border border-white/20 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-md transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            <span>Subir Video</span>
          </button>

          {currentShort.streamer.id && (
            <button
              onClick={() => {
                const targetStreamer = streamers.find(s => s.id === currentShort.streamer.id);
                if (targetStreamer) onSelectStream(targetStreamer);
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all duration-200 active:scale-95 animate-pulse"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>EN VIVO</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Action Column */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col space-y-5 items-center">
        {currentShort.streamer.id && (
          <button
            onClick={() => {
              const targetStreamer = streamers.find(s => s.id === currentShort.streamer.id);
              if (targetStreamer) onSelectStream(targetStreamer);
            }}
            className="relative group transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <img
              src={currentShort.streamer.avatar}
              alt={currentShort.streamer.displayName}
              className="w-12 h-12 rounded-full object-cover border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
            />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase shadow">
              LIVE
            </div>
          </button>
        )}

        <div className="flex flex-col items-center space-y-1">
          <div className="p-3 bg-stone-900/80 rounded-full border border-white/10 text-rose-500 shadow-xl backdrop-blur-md">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <span className="text-[10px] font-black text-stone-200">{currentShort.likes}</span>
        </div>

        <div className="flex flex-col items-center space-y-1">
          <div className="p-3 bg-stone-900/80 rounded-full border border-white/10 text-white shadow-xl backdrop-blur-md">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-stone-200">{currentShort.comments}</span>
        </div>

        <div className="flex flex-col items-center space-y-1">
          <div className="p-3 bg-stone-900/80 rounded-full border border-white/10 text-white shadow-xl backdrop-blur-md">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-stone-200">Compartir</span>
        </div>
      </div>

      {/* Bottom Creator Info Card & Stream Call-To-Action */}
      <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/90 to-transparent space-y-3 pt-8">
        <div>
          <div className="text-sm font-black text-white flex items-center space-x-2">
            <span>@{currentShort.streamer.username}</span>
            <span className="bg-purple-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              Creador Verificado
            </span>
          </div>
          <p className="text-xs text-stone-300 mt-1 line-clamp-2 font-medium">{currentShort.title}</p>
        </div>

        {currentShort.streamer.id ? (
          <button
            onClick={() => {
              const targetStreamer = streamers.find(s => s.id === currentShort.streamer.id);
              if (targetStreamer) onSelectStream(targetStreamer);
            }}
            className="w-full bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 text-white font-black text-xs py-3 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Radio className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>Unirse a la Transmisión EN VIVO de {currentShort.streamer.displayName}</span>
          </button>
        ) : (
          <button
            onClick={onOpenUploadModal}
            className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs py-3 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Film className="w-4 h-4" />
            <span>Subir Más Videos Cortos</span>
          </button>
        )}

        {/* Video switcher dots */}
        <div className="flex justify-center space-x-2 pt-1">
          {allShorts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveVideoIdx(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeVideoIdx === idx ? 'w-6 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'w-1.5 bg-stone-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

