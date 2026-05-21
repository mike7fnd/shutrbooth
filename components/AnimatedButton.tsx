'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

type ButtonVariant = 'ink' | 'warm' | 'cream' | 'outline' | 'ghost' | 'gradient';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface AnimatedButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-sm',
  xl: 'px-10 py-5 text-base',
};

const variantClasses: Record<ButtonVariant, string> = {
  ink: 'bg-charcoal text-paper font-semibold shadow-card hover:shadow-lifted',
  warm: 'bg-white border border-[#D5CCB8] text-charcoal font-medium shadow-paper hover:shadow-card',
  cream: 'bg-cream border border-[#D5CCB8] text-charcoal font-medium shadow-paper hover:shadow-card',
  outline: 'border border-[#D5CCB8] text-charcoal font-medium hover:bg-cream/50',
  ghost: 'text-warm-gray font-medium hover:text-charcoal hover:bg-cream/50',
  /* kept for compatibility — renders same as ink */
  gradient: 'bg-charcoal text-paper font-semibold shadow-card hover:shadow-lifted',
};

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      variant = 'ink',
      size = 'md',
      onClick,
      children,
      className,
      disabled = false,
      type = 'button',
      loading = false,
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        whileHover={!disabled && !loading ? { y: -2 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
        transition={{ duration: 0.2 }}
        className={clsx(
          'relative inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 cursor-pointer select-none',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
