'use client';
import { motion } from 'framer-motion';

interface Props {
  src: string;
  from: { x: number; y: number; width: number; height: number };
  to: { x: number; y: number; width: number; height: number };
  onComplete: () => void;
}

export default function FlyingPhoto({ src, from, to, onComplete }: Props) {
  const dx = to.x + to.width / 2 - (from.x + from.width / 2);
  const dy = to.y + to.height / 2 - (from.y + from.height / 2);
  const scale = Math.min((to.width * 0.78) / from.width, (to.height * 0.65) / from.height);

  return (
    <motion.div
      className="fixed pointer-events-none z-[999]"
      style={{ left: from.x, top: from.y, width: from.width, height: from.height }}
      initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
      animate={{
        x: [0, dx * 0.38, dx],
        y: [0, dy * 0.12 - 50, dy],
        scale: [1, 0.72, scale],
        rotate: [0, -8, 2],
        opacity: [1, 1, 0],
      }}
      transition={{
        times: [0, 0.4, 1],
        duration: 0.72,
        ease: [0.25, 0.46, 0.45, 0.94],
        opacity: { times: [0, 0.8, 1], duration: 0.72 },
      }}
      onAnimationComplete={onComplete}
    >
      <div
        className="w-full h-full rounded-xl overflow-hidden shadow-2xl"
        style={{ background: 'white', padding: '3px 3px 13px' }}
      >
        <img src={src} alt="" className="w-full h-full object-cover rounded-[2px]" />
      </div>
    </motion.div>
  );
}
