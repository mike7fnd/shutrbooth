'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [
  { label: 'pink',     color: '#FF6EC7' },
  { label: 'blue',     color: '#4DABF7' },
  { label: 'purple',   color: '#B197FC' },
  { label: 'peach',    color: '#FFA94D' },
  { label: 'teal',     color: '#38D9A9' },
  { label: 'red',      color: '#FF6B6B' },
  { label: 'gold',     color: '#FFD43B' },
  { label: 'lavender', color: '#E599F7' },
];

interface Props {
  color: string | null;
  intensity: number;
  onChange: (color: string | null, intensity: number) => void;
}

export default function ColorRingLight({ color, intensity, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#ff99cc');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Squircle toggle */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(v => !v)}
        title="Ring light"
        className="w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-paper overflow-hidden"
        style={color ? {
          background: color,
          borderColor: 'transparent',
          boxShadow: `0 0 14px ${color}90`,
        } : {
          background: 'white',
          borderColor: '#E5E0D8',
        }}
      >
        {/* Ring light icon: concentric rings */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="3"  fill={color ?? '#C4BAB0'} opacity="0.9" />
          <circle cx="9" cy="9" r="5.5" stroke={color ?? '#C4BAB0'} strokeWidth="1.2" opacity="0.55" fill="none" />
          <circle cx="9" cy="9" r="8"  stroke={color ?? '#C4BAB0'} strokeWidth="1"   opacity="0.25" fill="none" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-14 left-1/2 -translate-x-1/2 w-64 bg-white/96 backdrop-blur-md border border-[#E5E0D8] rounded-2xl shadow-card-lg p-4 z-50"
          >
            {/* Header */}
            <p className="text-charcoal text-xs font-semibold tracking-wide mb-3">ring light</p>

            {/* Preset grid */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {/* Off */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => onChange(null, intensity)}
                className="aspect-square rounded-xl border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: !color ? '#2D2926' : '#E5E0D8',
                  background: '#F5F3F0',
                }}
              >
                <span className="text-warm-gray text-[9px] font-semibold tracking-wide">off</span>
              </motion.button>

              {PRESETS.map(p => (
                <motion.button
                  key={p.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onChange(p.color, intensity)}
                  title={p.label}
                  className="aspect-square rounded-xl border-2 transition-all"
                  style={{
                    background: p.color,
                    borderColor: color === p.color ? '#2D2926' : 'transparent',
                    boxShadow: color === p.color ? `0 0 8px ${p.color}70` : 'none',
                  }}
                />
              ))}
            </div>

            {/* Custom colour picker */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-warm-gray text-xs flex-1">custom</span>
              <label className="relative cursor-pointer group flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border-2 transition-all"
                  style={{
                    background: customColor,
                    borderColor: color === customColor ? '#2D2926' : '#E5E0D8',
                    boxShadow: color === customColor ? `0 0 8px ${customColor}70` : 'none',
                  }}
                />
                <span className="text-warm-gray text-xs group-hover:text-charcoal transition-colors">pick colour</span>
                <input
                  type="color"
                  value={customColor}
                  onChange={e => {
                    setCustomColor(e.target.value);
                    onChange(e.target.value, intensity);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>

            {/* Intensity slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-warm-gray text-xs">intensity</span>
                <span className="text-charcoal text-xs font-semibold">{Math.round(intensity * 100)}%</span>
              </div>
              <div className="relative h-2 rounded-full overflow-hidden" style={{ background: '#EDE8E1' }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all"
                  style={{
                    width: `${intensity * 100}%`,
                    background: color ?? '#C4BAB0',
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(intensity * 100)}
                  onChange={e => onChange(color, parseInt(e.target.value) / 100)}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
