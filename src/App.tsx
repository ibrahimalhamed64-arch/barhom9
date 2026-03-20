/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Mail, Heart, Sparkles, Music, Music2 } from 'lucide-react';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [recipientName] = useState('أحلى الناس'); // Default name in Arabic
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      
      // Play music
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.log("Playback blocked:", err));
        setIsPlaying(true);
      }

      // Trigger confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[#fdfaf6]">
      <audio 
        ref={audioRef} 
        src="/audio.m4a" 
        loop 
        preload="auto"
      />

      {/* Music Toggle */}
      <button 
        onClick={toggleMusic}
        className="absolute top-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-rose-100 text-rose-500 hover:bg-rose-50 transition-all"
      >
        {isPlaying ? <Music className="w-5 h-5 animate-pulse" /> : <Music2 className="w-5 h-5 opacity-50" />}
      </button>

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-200 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-100 blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="closed"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="flex flex-col items-center gap-8 z-10"
          >
            <div className="text-center space-y-2">
              <h1 className="font-serif text-3xl md:text-4xl text-rose-800 italic">عيد فطر سعيد</h1>
              <p className="font-sans text-sm text-gray-500 uppercase tracking-widest">اضغط لفتح المفاجأة</p>
            </div>

            <motion.button
              onClick={handleOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
            >
              {/* Envelope Shadow */}
              <div className="absolute inset-0 bg-black/5 blur-xl transform translate-y-4 scale-95 rounded-lg" />
              
              {/* The Envelope */}
              <div className="relative w-72 h-48 md:w-80 md:h-56 bg-white border border-rose-100 rounded-lg shadow-sm flex flex-col items-center justify-center overflow-hidden">
                {/* Envelope Flap Design */}
                <div className="absolute top-0 left-0 w-full h-full border-t-[100px] border-t-rose-50/50 border-x-[150px] border-x-transparent md:border-x-[160px]" />
                
                <div className="z-10 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-2">
                    <Mail className="text-rose-400 w-6 h-6" />
                  </div>
                  <div className="font-serif text-xl text-rose-900">إلى: {recipientName}</div>
                </div>

                {/* Wax Seal */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-10 h-10 bg-rose-600 rounded-full shadow-lg flex items-center justify-center border-2 border-rose-700">
                    <Heart className="text-white w-5 h-5 fill-current" />
                  </div>
                </div>
              </div>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="opened"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="z-20 w-full max-w-lg mx-auto"
          >
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-rose-50 relative overflow-hidden">
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-rose-600" />
              </div>

              <div className="relative z-10 text-center space-y-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full mb-4"
                >
                  <Heart className="text-rose-500 w-8 h-8 fill-current" />
                </motion.div>

                <div className="space-y-4">
                  <h2 className="font-serif text-4xl md:text-5xl text-rose-900 leading-tight">
                    كل عام وأنت بخير
                  </h2>
                  <div className="h-px w-24 bg-rose-200 mx-auto" />
                  
                  <p className="font-serif text-xl md:text-2xl text-rose-800 leading-relaxed italic">
                    "أحياناً يكون العيد شخص لست بانتظار عيداً لأهنئك إنما وجودك معي عيدي دائماً ان شاء الله دايما على طول اشوفك مبسوطه يارب وتتهني بالعيد يارب الله يسعدك يارب يوفقك ويبعد عنك كل حسود كنتي بتجنني زي القمر ❣."
                  </p>

                  {/* 50 Dinar Image (Eidiya) */}
                  <motion.div
                    initial={{ y: 20, opacity: 0, rotate: 2 }}
                    animate={{ y: 0, opacity: 1, rotate: 2 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="relative w-full max-w-[320px] mx-auto mt-8 rounded-lg overflow-hidden shadow-2xl border-2 border-rose-100 group bg-white"
                  >
                    <img 
                      src="/50_dinar.png" 
                      alt="50 Dinars"
                      className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                    />
                  </motion.div>
                </div>

                <div className="pt-8 flex flex-col items-center gap-4">
                  <div className="font-serif text-2xl text-rose-900">صديقك المخلص</div>
                </div>

                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="mt-8 text-rose-400 hover:text-rose-600 text-sm font-sans transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  إغلاق الرسالة
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
