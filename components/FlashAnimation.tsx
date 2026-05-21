'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashAnimationProps {
  isFlashing: boolean;
  onComplete?: () => void;
}

export default function FlashAnimation({ isFlashing, onComplete }: FlashAnimationProps) {
  useEffect(() => {
    if (isFlashing && onComplete) {
      const timer = setTimeout(onComplete, 400);
      return () => clearTimeout(timer);
    }
  }, [isFlashing, onComplete]);

  return (
    <AnimatePresence>
      {isFlashing && (
        <motion.div
          key="flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.4,
            times: [0, 0.1, 0.3, 1],
            ease: 'easeOut',
          }}
          className="fixed inset-0 z-[9999] bg-paper pointer-events-none"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}
