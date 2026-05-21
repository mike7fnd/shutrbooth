'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CameraOff, Loader2 } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';

interface CameraPreviewProps {
  filterCSS?: string;
  onVideoRef?: (video: HTMLVideoElement | null) => void;
  className?: string;
}

export default function CameraPreview({ filterCSS = '', onVideoRef, className = '' }: CameraPreviewProps) {
  const { videoRef, isLoading, error, facingMode } = useCamera();

  useEffect(() => {
    if (onVideoRef) onVideoRef(videoRef.current);
  }, [videoRef, onVideoRef]);

  const isMirrored = facingMode === 'user';

  return (
    <div
      className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#1A1814] border border-[#E5E0D8] shadow-card-lg ${className}`}
    >
      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-[#1A1814]">
          <Loader2 className="w-8 h-8 text-warm-gray animate-spin" />
          <p className="text-warm-gray/60 text-xs tracking-wide">starting camera...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-[#1A1814] p-6">
          <div className="w-14 h-14 rounded-full bg-[#2A2520] border border-[#3A3028] flex items-center justify-center">
            <CameraOff className="w-6 h-6 text-faded-brown/60" />
          </div>
          <div className="text-center">
            <p className="text-warm-gray/80 text-sm font-medium mb-1">camera unavailable</p>
            <p className="text-warm-gray/40 text-xs max-w-xs">{error}</p>
          </div>
        </div>
      )}

      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{
          filter: filterCSS || 'none',
          transform: isMirrored ? 'scaleX(-1)' : 'none',
          display: isLoading || error ? 'none' : 'block',
        }}
      />

      {/* Analog viewfinder corners */}
      {!isLoading && !error && (
        <>
          <div className="absolute top-4 left-4 w-7 h-7 border-t border-l border-paper/30 rounded-tl pointer-events-none" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t border-r border-paper/30 rounded-tr pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b border-l border-paper/30 rounded-bl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b border-r border-paper/30 rounded-br pointer-events-none" />

          {/* Minimal live dot */}
          <motion.div
            className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 rounded-full px-2.5 py-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-faded-brown"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-paper/50 text-[10px] tracking-widest">REC</span>
          </motion.div>
        </>
      )}
    </div>
  );
}
