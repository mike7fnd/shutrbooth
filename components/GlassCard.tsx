'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface PaperCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  delay?: number;
  rotate?: string;
  variant?: 'white' | 'cream';
  /* kept for backwards compatibility — ignored */
  glow?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function GlassCard({
  children,
  className,
  hover = true,
  onClick,
  padding = 'md',
  delay = 0,
  rotate,
  variant = 'white',
}: PaperCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -3, transition: { duration: 0.25 } } : {}}
      onClick={onClick}
      style={rotate ? { rotate } : undefined}
      className={clsx(
        variant === 'white'
          ? 'bg-white border border-[#E5E0D8]'
          : 'bg-cream border border-[#DDD5C8]',
        'rounded-2xl shadow-card',
        hover && 'transition-shadow duration-300 hover:shadow-card-lg cursor-pointer',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
