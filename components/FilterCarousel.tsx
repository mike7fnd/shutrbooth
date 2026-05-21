'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Film,
  Circle,
  Video,
  Sun,
  Zap,
  Cloud,
  Monitor,
  Aperture,
  Palette,
} from 'lucide-react';
import { FILTERS, FilterName } from '@/lib/filters';

const FILTER_ICONS: Record<FilterName, React.ReactNode> = {
  none:      <Sparkles className="w-3.5 h-3.5" />,
  vintage:   <Film     className="w-3.5 h-3.5" />,
  bw:        <Circle   className="w-3.5 h-3.5" />,
  film:      <Video    className="w-3.5 h-3.5" />,
  warm:      <Sun      className="w-3.5 h-3.5" />,
  cyberpunk: <Zap      className="w-3.5 h-3.5" />,
  dreamy:    <Cloud    className="w-3.5 h-3.5" />,
  vhs:       <Monitor  className="w-3.5 h-3.5" />,
  grainy:    <Aperture className="w-3.5 h-3.5" />,
  pastel:    <Palette  className="w-3.5 h-3.5" />,
};

interface FilterCarouselProps {
  selectedFilter: FilterName;
  onFilterChange: (filter: FilterName) => void;
}

export default function FilterCarousel({ selectedFilter, onFilterChange }: FilterCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto py-2 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FILTERS.map((filter, index) => {
          const isSelected = selectedFilter === filter.name;

          return (
            <motion.button
              key={filter.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onFilterChange(filter.name)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-charcoal text-paper shadow-card'
                  : 'bg-white border border-[#E5E0D8] text-warm-gray hover:text-charcoal hover:border-[#D0C8BC] shadow-paper'
              }`}
            >
              {FILTER_ICONS[filter.name]}
              <span>{filter.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
