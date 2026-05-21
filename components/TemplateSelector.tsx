'use client';
import { motion } from 'framer-motion';
import { TEMPLATES, StripTemplate } from '@/lib/templates';

interface Props {
  selected: StripTemplate;
  onChange: (t: StripTemplate) => void;
}

export default function TemplateSelector({ selected, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-warm-gray text-[10px] tracking-widest uppercase">template</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TEMPLATES.map(t => {
          const isActive = t.id === selected.id;
          return (
            <motion.button
              key={t.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(t)}
              className="flex-none flex flex-col items-center gap-1 focus:outline-none"
            >
              {/* Mini strip thumbnail */}
              <div
                className="relative w-10 rounded-lg overflow-hidden transition-all duration-200"
                style={{
                  background: t.stripBg,
                  border: `2px solid ${isActive ? '#2D2926' : t.borderColor}`,
                  boxShadow: isActive ? '0 0 0 1px #2D2926' : 'none',
                  height: '52px',
                }}
              >
                {/* Three mini photo slots */}
                <div className="flex flex-col gap-[3px] p-[4px]">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-full rounded-[2px]"
                      style={{
                        height: '11px',
                        background: t.thumbAccent,
                        opacity: 0.5 + i * 0.18,
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Name */}
              <span
                className="text-[9px] font-medium tracking-wide transition-colors"
                style={{ color: isActive ? '#2D2926' : '#8B7D72' }}
              >
                {t.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
