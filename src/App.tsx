/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Mail, Heart, Sparkles, Music, Music2, Volume2, VolumeX } from 'lucide-react';
import { Howl, Howler } from 'howler';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [recipientName] = useState('أحلى الناس');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState<string>('جاهز');
  const [imageSrc, setImageSrc] = useState('50_dinar.png');
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize Howl
    soundRef.current = new Howl({
      src: ['./eid-music.m4a', '/eid-music.m4a', 'eid-music.m4a'],
      html5: true, // Use HTML5 Audio for better compatibility with large files and streaming
      loop: true,
      volume: 1.0,
      onload: () => {
        console.log("Audio loaded successfully with Howler");
        setAudioStatus('جاهز للتشغيل');
      },
      onloaderror: (id, error) => {
        console.error("Howler load error:", error);
        setAudioStatus('خطأ في التحميل');
      },
      onplay: () => {
        setIsPlaying(true);
        setAudioStatus('يعمل الآن');
      },
      onpause: () => {
        setIsPlaying(false);
        setAudioStatus('متوقف');
      },
      onstop: () => {
        setIsPlaying(false);
        setAudioStatus('متوقف');
      },
      onplayerror: (id, error) => {
        console.error("Howler play error:", error);
        setAudioStatus('خطأ في التشغيل');
        // Try to unlock audio context on next user interaction
        Howler.unload();
        soundRef.current?.play();
      }
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  const handleImageError = () => {
    console.error("Image failed to load:", imageSrc);
    if (imageSrc === '50_dinar.png') {
      setImageSrc('/50_dinar.png');
    } else if (imageSrc === '/50_dinar.png') {
      setImageSrc('./50_dinar.png');
    } else if (imageSrc === './50_dinar.png') {
      // Try absolute URL as a last resort before fallback
      const absoluteUrl = `${window.location.origin}/50_dinar.png`;
      if (imageSrc !== absoluteUrl) {
        setImageSrc(absoluteUrl);
      } else {
        setImageSrc('https://picsum.photos/seed/money/600/300');
      }
    }
  };

  const [audioError, setAudioError] = React.useState<string | null>(null);

  const toggleMusic = () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const handleOpen = () => {
    if (!isOpen && !isOpening) {
      setIsOpening(true);
      
      // Force play audio with Howler
      if (soundRef.current) {
        setAudioStatus('جاري التشغيل...');
        soundRef.current.play();
      }
      
      // Delay the actual "open" state to allow flap animation
      setTimeout(() => {
        setIsOpen(true);
        setIsOpening(false);
        triggerConfetti();
      }, 1000);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (soundRef.current) {
      soundRef.current.stop();
    }
  };

  const triggerConfetti = () => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

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
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[#fdfaf6] overflow-x-hidden">
      {/* Debug Info for User - Hidden by default, visible on hover */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-black/80 text-white p-3 rounded-lg text-[10px] shadow-xl backdrop-blur-sm">
          <p>الحالة: {audioStatus}</p>
          {audioError && <p className="text-red-300">خطأ: {audioError}</p>}
          <button 
            onClick={() => {
              Howler.unload();
              soundRef.current?.play();
            }}
            className="mt-2 bg-white/20 px-2 py-1 rounded hover:bg-white/30"
          >
            إعادة تحميل الصوت
          </button>
        </div>
      </div>

      {/* Music Toggle */}
      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleMusic();
        }}
        className="fixed top-6 right-6 z-50 p-4 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-rose-100 text-rose-500 hover:bg-rose-50 transition-all group"
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 animate-pulse" />
        ) : (
          <VolumeX className="w-6 h-6 opacity-40 group-hover:opacity-100" />
        )}
      </motion.button>

      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-200/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-100/50 blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="closed"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0, transition: { duration: 0.5 } }}
            className="flex flex-col items-center gap-12 z-10 w-full max-w-md"
          >
            <div className="text-center space-y-4">
              <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="font-serif text-4xl md:text-6xl text-rose-900 italic font-bold"
              >
                عيد فطر سعيد
              </motion.h1>
              <p className="font-sans text-xs md:text-sm text-rose-400 uppercase tracking-[0.3em] font-medium">
                اضغط على الظرف لفتح المفاجأة
              </p>
            </div>

            <motion.div
              onClick={handleOpen}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative cursor-pointer perspective-1000 group"
            >
              {/* Envelope Shadow */}
              <div className="absolute inset-0 bg-black/10 blur-2xl transform translate-y-8 scale-90 rounded-xl" />
              
              {/* The Envelope Body */}
              <div className="relative w-[320px] h-[220px] md:w-[400px] md:h-[280px] bg-[#fcfcfc] border border-rose-100 rounded-xl shadow-xl flex flex-col items-center justify-center overflow-hidden">
                
                {/* Envelope Flap (Animated) */}
                <motion.div 
                  initial={false}
                  animate={{ 
                    rotateX: isOpening ? -180 : 0,
                    zIndex: isOpening ? 0 : 20
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{ transformOrigin: "top" }}
                  className="absolute top-0 left-0 w-full h-1/2 bg-[#f8f8f8] border-b border-rose-100 shadow-sm z-20"
                >
                  {/* Triangle Flap Shape */}
                  <div className="absolute inset-0 border-t-[140px] border-t-rose-50/80 border-x-[160px] md:border-x-[200px] border-x-transparent" />
                </motion.div>

                {/* Content Inside (Visible when opening) */}
                <div className="z-10 flex flex-col items-center gap-4">
                  <motion.div 
                    animate={isOpening ? { y: -20, opacity: 0 } : {}}
                    className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-2 shadow-inner"
                  >
                    <Mail className="text-rose-400 w-8 h-8" />
                  </motion.div>
                  <motion.div 
                    animate={isOpening ? { y: -20, opacity: 0 } : {}}
                    className="font-serif text-2xl text-rose-900 font-medium"
                  >
                    إلى: {recipientName}
                  </motion.div>
                </div>

                {/* Wax Seal */}
                <motion.div 
                  animate={isOpening ? { y: -100, opacity: 0, scale: 0.5 } : {}}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                >
                  <div className="w-14 h-14 bg-rose-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-rose-700/50 group-hover:scale-110 transition-transform">
                    <Heart className="text-white w-7 h-7 fill-current" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="opened"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="z-20 w-full max-w-2xl mx-auto py-12"
          >
            <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-rose-50 relative overflow-hidden">
              {/* Card Decoration */}
              <div className="absolute -top-12 -right-12 opacity-5">
                <Sparkles className="w-64 h-64 text-rose-600" />
              </div>
              <div className="absolute -bottom-12 -left-12 opacity-5 rotate-180">
                <Sparkles className="w-64 h-64 text-rose-600" />
              </div>

              <div className="relative z-10 text-center space-y-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-rose-50 rounded-full mb-4 shadow-sm"
                >
                  <Heart className="text-rose-500 w-10 h-10 fill-current" />
                </motion.div>

                <div className="space-y-6">
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="font-serif text-5xl md:text-7xl text-rose-950 leading-tight font-bold"
                  >
                    كل عام وأنت بخير
                  </motion.h2>
                  
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: 120 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="h-1 bg-rose-200 mx-auto rounded-full" 
                  />
                  
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="font-serif text-2xl md:text-3xl text-rose-900 leading-[1.6] italic px-4"
                  >
                    "أحياناً يكون العيد شخصاً... لست بانتظار عيدٍ لأهنئك، إنما وجودك معي هو عيدي دائماً. ان شاء الله دايماً وأبداً أشوفك مبسوطة وتتهني بالعيد يارب. الله يسعدك ويوفقك ويبعد عنك كل سوء... كنتِ بتجنني زي القمر ❣."
                  </motion.p>

                  {/* 50 Dinar Image (Eidiya) */}
                  <motion.div
                    initial={{ y: 50, opacity: 0, rotate: 5, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, rotate: -2, scale: 1 }}
                    transition={{ delay: 1.8, duration: 1, type: "spring" }}
                    className="relative w-full max-w-[380px] mx-auto mt-12 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-white group bg-white"
                  >
                    <div className="relative w-full aspect-[2/1] bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img 
                        src={imageSrc} 
                        alt="50 Dinars"
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        onLoad={() => console.log("Image loaded successfully:", imageSrc)}
                        onError={handleImageError}
                      />
                    </div>
                    <div className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-rose-600 font-bold text-sm shadow-sm">
                      عيدية خاصة 🎁
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="pt-12 flex flex-col items-center gap-6"
                >
                  <div className="font-serif text-3xl text-rose-950 font-medium">صديقك المخلص</div>
                  
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 rounded-full border border-rose-100 text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all text-sm font-medium tracking-widest uppercase"
                  >
                    إغلاق الرسالة
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

