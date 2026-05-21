'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
  duration?: number;
}

export default function CountdownOverlay({ isVisible, onComplete, duration = 3 }: CountdownOverlayProps) {
  const [count, setCount] = useState(duration);
  const [showSmile, setShowSmile] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setCount(duration);
      setShowSmile(false);
      return;
    }

    setCount(duration);
    setShowSmile(false);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowSmile(true);
          setTimeout(() => onComplete(), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="countdown"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex items-center justify-center z-30 rounded-2xl"
        style={{ background: 'rgba(26,24,20,0.55)', backdropFilter: 'blur(2px)' }}
      >
        <AnimatePresence mode="wait">
          {showSmile ? (
            <motion.div
              key="smile"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-5xl">🙂</span>
              <p className="text-paper/80 text-sm font-medium tracking-widest uppercase font-serif italic">
                smile!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={count}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center gap-3"
            >
              {/* Analog counter ring */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-paper/20" />
                <span className="font-serif text-6xl text-paper/90 italic leading-none">{count}</span>
              </div>
              <p className="text-paper/40 text-[10px] tracking-widest uppercase">get ready</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
