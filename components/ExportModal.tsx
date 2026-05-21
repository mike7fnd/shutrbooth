'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, Check } from 'lucide-react';
import { exportPhotoStripFromElement } from '@/lib/export';
import AnimatedButton from './AnimatedButton';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
  layout: string;
}

export default function ExportModal({ isOpen, onClose, photos, layout }: ExportModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await exportPhotoStripFromElement('export-modal-strip', `snapbooth-${layout}-${Date.now()}.png`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const element = document.getElementById('export-modal-strip');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#F8F6F2',
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            console.log('Clipboard API not supported');
          }
        }
      });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-charcoal/30 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4"
          >
            <div className="bg-paper border border-[#E5E0D8] rounded-3xl shadow-lifted overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E0D8]">
                <div>
                  <h2 className="serif text-xl text-charcoal font-normal">your strip</h2>
                  <p className="text-warm-gray text-xs mt-0.5">save or copy your photo strip</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-cream border border-[#E5E0D8] flex items-center justify-center text-warm-gray hover:text-charcoal transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Strip preview */}
              <div className="p-5">
                <div
                  id="export-modal-strip"
                  className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden shadow-card"
                >
                  {/* Header label */}
                  <div className="px-4 py-2 border-b border-[#F0EBE3] flex items-center justify-between">
                    <span className="text-warm-gray text-[9px] tracking-widest uppercase">snapbooth</span>
                    <span className="text-warm-gray text-[9px]">{new Date().getFullYear()}</span>
                  </div>

                  {/* Photos */}
                  <div className="p-3 flex flex-col gap-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative overflow-hidden rounded-[2px] bg-white p-1 pb-3 shadow-paper">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full object-cover rounded-[1px]"
                          style={{ aspectRatio: '4/3', display: 'block' }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 border-t border-[#F0EBE3]">
                    <p className="text-center text-warm-gray/50 text-[9px] tracking-widest uppercase">
                      {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 flex flex-col gap-2">
                <AnimatedButton
                  variant="ink"
                  size="lg"
                  onClick={handleDownload}
                  loading={isDownloading}
                  className="w-full justify-center"
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? 'saving...' : 'download PNG'}
                </AnimatedButton>

                <div className="flex gap-2">
                  <AnimatedButton
                    variant="warm"
                    size="md"
                    onClick={handleCopy}
                    loading={isCopying}
                    className="flex-1 justify-center"
                  >
                    {copied ? (
                      <><Check className="w-4 h-4 text-sage" />copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" />copy</>
                    )}
                  </AnimatedButton>

                  <AnimatedButton variant="outline" size="md" onClick={onClose} className="flex-1 justify-center">
                    close
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
