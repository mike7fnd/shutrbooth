'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, RotateCcw, ImageOff } from 'lucide-react';
import { exportPhotoStripFromElement, StripLayout } from '@/lib/export';
import { StripTemplate } from '@/lib/templates';
import TemplateSelector from './TemplateSelector';
import AnimatedButton from './AnimatedButton';

interface PhotoStripBuilderProps {
  photos: string[];
  layout: StripLayout;
  template: StripTemplate;
  onTemplateChange: (t: StripTemplate) => void;
  onClear: () => void;
  onRetake: (index: number) => void;
}

const ROTATIONS = ['-1.2deg', '0.8deg', '-0.5deg', '1deg'];

export default function PhotoStripBuilder({
  photos,
  layout,
  template,
  onTemplateChange,
  onClear,
  onRetake,
}: PhotoStripBuilderProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportPhotoStripFromElement('photo-strip-preview', `shuttrbooth-${layout}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  const t = template;
  const maxPhotos = 4;
  const displaySlots = Array.from({ length: maxPhotos }, (_, i) => photos[i] || null);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-charcoal font-semibold text-sm">
          your strip{' '}
          <span className="text-warm-gray font-normal">({photos.length}/{maxPhotos})</span>
        </h3>
        {photos.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClear}
            className="flex items-center gap-1 text-warm-gray hover:text-faded-brown text-xs transition-colors duration-200"
          >
            <Trash2 className="w-3 h-3" />
            clear
          </motion.button>
        )}
      </div>

      {/* Template selector */}
      <TemplateSelector selected={t} onChange={onTemplateChange} />

      {/* Strip Preview */}
      <div
        id="photo-strip-preview"
        className="flex-1 flex flex-col rounded-2xl overflow-hidden"
        style={{ background: t.stripBg, border: `1px solid ${t.borderColor}` }}
      >
        {/* Strip label */}
        <div
          className="px-4 py-2.5 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: `1px solid ${t.dividerColor}` }}
        >
          <span className="text-[10px] tracking-widest uppercase font-medium" style={{ color: t.labelText }}>
            shuttrbooth
          </span>
          <span className="text-[10px]" style={{ color: t.labelText }}>
            {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Photos */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          <AnimatePresence>
            {displaySlots.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                className="relative group w-full"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {photo ? (
                  <div
                    className="relative overflow-hidden rounded-sm shadow-photo"
                    style={{
                      padding: '4px 4px 16px',
                      background: t.photoFrameBg,
                      rotate: ROTATIONS[index],
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full object-cover rounded-[1px]"
                      style={{ aspectRatio: layout === 'square' ? '1/1' : '4/3', display: 'block' }}
                    />
                    <AnimatePresence>
                      {hoveredIndex === index && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-charcoal/30 flex items-center justify-center rounded-[1px]"
                          style={{ top: 4, left: 4, right: 4, bottom: 16 }}
                        >
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onRetake(index)}
                            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-charcoal hover:bg-white transition-colors shadow-card"
                            title="Retake"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div
                    className="w-full rounded-sm border border-dashed flex items-center justify-center"
                    style={{
                      aspectRatio: layout === 'square' ? '1/1' : '4/3',
                      background: t.emptySlotBg,
                      borderColor: t.emptySlotBorder,
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <ImageOff className="w-4 h-4" style={{ color: `${t.labelText}60` }} />
                      <span className="text-[10px] tracking-wide" style={{ color: `${t.labelText}60` }}>
                        shot {index + 1}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Strip bottom dots */}
        <div
          className="px-4 py-2.5 flex-shrink-0"
          style={{ borderTop: `1px solid ${t.dividerColor}` }}
        >
          <div className="flex items-center justify-center gap-1">
            {Array.from({ length: maxPhotos }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i < photos.length ? '8px' : '6px',
                  height: i < photos.length ? '8px' : '6px',
                  background: i < photos.length ? t.dotActive : t.dotInactive,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Download */}
      {photos.length === maxPhotos && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <AnimatedButton
            variant="ink"
            size="md"
            onClick={handleExport}
            loading={isExporting}
            className="w-full justify-center"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'exporting...' : 'download strip'}
          </AnimatedButton>
        </motion.div>
      )}

      {photos.length > 0 && photos.length < maxPhotos && (
        <p className="text-warm-gray text-xs text-center">
          {maxPhotos - photos.length} more photo{maxPhotos - photos.length !== 1 ? 's' : ''} to complete
        </p>
      )}
    </div>
  );
}
