'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  FlipHorizontal,
  Layers,
  Square,
  Film,
  Download,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useCamera } from '@/hooks/useCamera';
import { useFilter } from '@/hooks/useFilter';
import { captureVideoFrame, StripLayout } from '@/lib/export';
import FilterCarousel from '@/components/FilterCarousel';
import CountdownOverlay from '@/components/CountdownOverlay';
import FlashAnimation from '@/components/FlashAnimation';
import PhotoStripBuilder from '@/components/PhotoStripBuilder';
import ExportModal from '@/components/ExportModal';
import FlyingPhoto from '@/components/FlyingPhoto';
import ColorRingLight from '@/components/ColorRingLight';
import { StripTemplate, DEFAULT_TEMPLATE } from '@/lib/templates';

const LAYOUT_OPTIONS: { id: StripLayout; label: string; icon: React.ReactNode; max: number }[] = [
  { id: 'strip',    label: 'strip',    icon: <Film className="w-3.5 h-3.5" />, max: 4 },
  { id: 'polaroid', label: 'polaroid', icon: <Layers className="w-3.5 h-3.5" />, max: 4 },
  { id: 'square',   label: 'square',   icon: <Square className="w-3.5 h-3.5" />, max: 4 },
];

export default function BoothPage() {
  const { videoRef, isLoading, error, switchCamera, facingMode } = useCamera();
  const { selectedFilter, setSelectedFilter, filterCSS } = useFilter();

  const [photos, setPhotos] = useState<string[]>([]);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [layout, setLayout] = useState<StripLayout>('strip');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null);
  const [autoMode, setAutoMode] = useState(false);
  const autoModeRef = useRef(false);

  const [template, setTemplate] = useState<StripTemplate>(DEFAULT_TEMPLATE);
  const [ringLightColor, setRingLightColor] = useState<string | null>(null);
  const [ringLightIntensity, setRingLightIntensity] = useState(0.55);

  const cameraViewRef = useRef<HTMLDivElement>(null);
  const stripPanelRef = useRef<HTMLDivElement>(null);
  const [flyingPhotos, setFlyingPhotos] = useState<Array<{
    id: number;
    src: string;
    from: { x: number; y: number; width: number; height: number };
    to: { x: number; y: number; width: number; height: number };
  }>>([]);

  const maxPhotos = LAYOUT_OPTIONS.find((l) => l.id === layout)?.max || 4;

  useEffect(() => {
    if (!isLoading && !error) {
      const t = setTimeout(() => setIsCameraReady(true), 800);
      return () => clearTimeout(t);
    }
    setIsCameraReady(false);
  }, [isLoading, error]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    setIsFlashing(true);
    const dataUrl = captureVideoFrame(videoRef.current, filterCSS);

    const fromEl = cameraViewRef.current;
    const toEl = stripPanelRef.current;
    if (fromEl && toEl) {
      const fr = fromEl.getBoundingClientRect();
      const tr = toEl.getBoundingClientRect();
      const id = Date.now();
      setFlyingPhotos(prev => [...prev, {
        id,
        src: dataUrl,
        from: { x: fr.left, y: fr.top, width: fr.width, height: fr.height },
        to: { x: tr.left, y: tr.top, width: tr.width, height: tr.height },
      }]);
    }

    setTimeout(() => {
      if (retakeIndex !== null) {
        setPhotos((prev) => {
          const updated = [...prev];
          updated[retakeIndex] = dataUrl;
          return updated;
        });
        setRetakeIndex(null);
      } else {
        setPhotos((prev) => (prev.length >= maxPhotos ? prev : [...prev, dataUrl]));
      }
    }, 520);
  }, [videoRef, filterCSS, retakeIndex, maxPhotos]);

  const handleCountdownComplete = useCallback(() => {
    setIsCountingDown(false);
    capturePhoto();
  }, [capturePhoto]);

  const handleCapture = () => {
    if (isCountingDown) return;
    if (retakeIndex === null && photos.length >= maxPhotos) return;
    setIsCountingDown(true);
  };

  const handleRetake = (index: number) => {
    setRetakeIndex(index);
    setIsCountingDown(true);
  };

  const handleClearStrip = () => {
    setPhotos([]);
    setRetakeIndex(null);
  };

  const handleLayoutChange = (newLayout: StripLayout) => {
    setLayout(newLayout);
    setPhotos([]);
    setRetakeIndex(null);
  };

  useEffect(() => { autoModeRef.current = autoMode; }, [autoMode]);

  useEffect(() => {
    if (!autoMode || !isCameraReady) return;
    if (photos.length >= maxPhotos) { setAutoMode(false); return; }
    if (isCountingDown) return;
    const t = setTimeout(() => {
      if (autoModeRef.current && photos.length < maxPhotos) setIsCountingDown(true);
    }, 800);
    return () => clearTimeout(t);
  }, [autoMode, photos.length, maxPhotos, isCameraReady, isCountingDown]);

  const isMirrored = facingMode === 'user';
  const stripComplete = photos.length >= maxPhotos;

  return (
    <div className="min-h-screen bg-paper flex flex-col pb-24 md:pb-0 lg:h-screen lg:overflow-hidden">

      {/* Virtual ring light — desktop only */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block"
        animate={{
          opacity: ringLightColor ? ringLightIntensity : 0,
          boxShadow: ringLightColor
            ? `inset 0 0 0px 70px ${ringLightColor}`
            : 'inset 0 0 0px 0px transparent',
        }}
        transition={{ duration: 0.35 }}
      />

      {/* Top Bar */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-[#E5E0D8] bg-paper/90 backdrop-blur-md sticky top-0 z-20 lg:flex-shrink-0 lg:static"
      >
        <Link href="/">
          <motion.div
            whileHover={{ x: -2 }}
            className="flex items-center gap-2 text-warm-gray hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">back</span>
          </motion.div>
        </Link>

        <span className="font-serif text-charcoal">ShuttrBooth</span>

        <div className="flex items-center gap-2">
          {stripComplete && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 bg-charcoal text-paper text-xs font-semibold px-4 py-2 rounded-lg shadow-card hover:shadow-lifted transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">save strip</span>
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:flex-row lg:justify-center gap-5 p-4 md:p-6 lg:p-5 lg:gap-5 max-w-6xl mx-auto w-full lg:h-full lg:overflow-hidden">

        {/* Left — Camera */}
        <div className="flex-1 flex flex-col gap-4 lg:flex-none lg:w-[400px] lg:gap-3">

          {/* Mode selector */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-warm-gray text-xs">mode</span>
            <div className="flex gap-1.5">
              {LAYOUT_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleLayoutChange(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    layout === opt.id
                      ? 'bg-charcoal text-paper shadow-card'
                      : 'bg-white border border-[#E5E0D8] text-warm-gray hover:text-charcoal hover:border-[#D0C8BC] shadow-paper'
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Camera viewfinder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div
              ref={cameraViewRef}
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E0D8] shadow-card-lg"
              style={{ background: '#1A1814' }}
            >
              {/* Loading */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                  <div className="w-8 h-8 rounded-full border border-paper/20 border-t-paper/60 animate-spin" />
                  <p className="text-paper/30 text-xs tracking-widest">starting camera...</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 z-10">
                  <div className="w-16 h-16 rounded-full bg-[#2A2520] border border-[#3A3028] flex items-center justify-center">
                    <Camera className="w-7 h-7 text-faded-brown/40" />
                  </div>
                  <div className="text-center">
                    <p className="text-paper/60 text-sm font-medium mb-1">camera unavailable</p>
                    <p className="text-paper/30 text-xs max-w-xs">{error}</p>
                  </div>
                </div>
              )}

              {/* Video */}
              {!error && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{
                    filter: filterCSS || 'none',
                    transform: isMirrored ? 'scaleX(-1)' : 'none',
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 0.4s ease',
                  }}
                />
              )}

              {/* Analog viewfinder corners */}
              {!isLoading && !error && (
                <>
                  <div className="absolute top-4 left-4 w-7 h-7 border-t border-l border-paper/25 rounded-tl pointer-events-none" />
                  <div className="absolute top-4 right-4 w-7 h-7 border-t border-r border-paper/25 rounded-tr pointer-events-none" />
                  <div className="absolute bottom-4 left-4 w-7 h-7 border-b border-l border-paper/25 rounded-bl pointer-events-none" />
                  <div className="absolute bottom-4 right-4 w-7 h-7 border-b border-r border-paper/25 rounded-br pointer-events-none" />

                  {/* REC indicator */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/25 rounded-full px-2.5 py-1">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-faded-brown"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-paper/40 text-[10px] tracking-widest">REC</span>
                  </div>

                  {/* Shot counter dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/25 rounded-full px-3 py-1.5">
                    {Array.from({ length: maxPhotos }).map((_, i) => (
                      <motion.div
                        key={i}
                        className={`rounded-full transition-all duration-300 ${
                          i < photos.length
                            ? 'w-2 h-2 bg-pale-peach'
                            : 'w-1.5 h-1.5 bg-paper/20'
                        }`}
                        animate={i < photos.length ? { scale: [1, 1.25, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Countdown overlay */}
              <AnimatePresence>
                {isCountingDown && (
                  <motion.div
                    className="absolute inset-0 z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CountdownOverlay
                      isVisible={isCountingDown}
                      onComplete={handleCountdownComplete}
                      duration={3}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <FilterCarousel selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-center gap-6"
          >
            {/* Left controls */}
            <div className="flex items-center gap-2">
              {/* Flip camera */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={switchCamera}
                disabled={isLoading || !!error}
                className="w-11 h-11 rounded-xl bg-white border border-[#E5E0D8] flex items-center justify-center text-warm-gray hover:text-charcoal hover:border-[#D0C8BC] transition-all duration-200 shadow-paper disabled:opacity-40"
                title="Switch camera"
              >
                <FlipHorizontal className="w-4 h-4" />
              </motion.button>

              {/* Ring light — desktop only */}
              <div className="hidden lg:block">
                <ColorRingLight
                  color={ringLightColor}
                  intensity={ringLightIntensity}
                  onChange={(c, i) => { setRingLightColor(c); setRingLightIntensity(i); }}
                />
              </div>
            </div>

            {/* Shutter */}
            <div className="relative">
              {!isCountingDown && !stripComplete && isCameraReady && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-charcoal/20"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              <motion.button
                whileHover={!isCountingDown && !stripComplete ? { scale: 1.04 } : {}}
                whileTap={!isCountingDown && !stripComplete ? { scale: 0.96 } : {}}
                onClick={handleCapture}
                disabled={isCountingDown || stripComplete || isLoading || !!error}
                className={`relative w-18 h-18 rounded-full flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed ${
                  isCountingDown || stripComplete
                    ? 'bg-cream border border-[#D5CCB8]'
                    : 'bg-charcoal shadow-card hover:shadow-lifted'
                }`}
                style={{ width: '72px', height: '72px' }}
              >
                <Camera
                  className={`w-7 h-7 ${isCountingDown || stripComplete ? 'text-warm-gray' : 'text-paper'}`}
                  strokeWidth={1.5}
                />
              </motion.button>
            </div>

            {/* Auto mode */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setAutoMode((v) => !v)}
              disabled={stripComplete || isLoading || !!error}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-paper disabled:opacity-40 ${
                autoMode
                  ? 'bg-charcoal border-charcoal text-paper'
                  : 'bg-white border-[#E5E0D8] text-warm-gray hover:text-charcoal hover:border-[#D0C8BC]'
              }`}
              title="Auto mode"
            >
              <Zap className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Status */}
          <div className="text-center min-h-[20px]">
            {stripComplete ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sage text-xs tracking-wide">
                strip complete — ready to save
              </motion.p>
            ) : isCountingDown ? (
              <p className="text-warm-gray text-xs italic font-serif">hold still...</p>
            ) : autoMode ? (
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="text-faded-brown text-xs tracking-wide"
              >
                auto — capturing {maxPhotos} photos
              </motion.p>
            ) : (
              <p className="text-warm-gray text-xs">
                {photos.length === 0
                  ? `press shutter to take ${maxPhotos} photos`
                  : `${maxPhotos - photos.length} more to go`}
              </p>
            )}
          </div>
        </div>

        {/* Right — Strip panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-60 xl:w-64 lg:h-full lg:flex lg:flex-col"
        >
          <div ref={stripPanelRef} className="bg-white border border-[#E5E0D8] rounded-2xl p-4 h-full min-h-[480px] lg:min-h-0 lg:flex-1 lg:overflow-y-auto flex flex-col shadow-card">
            <PhotoStripBuilder
              photos={photos}
              layout={layout}
              template={template}
              onTemplateChange={setTemplate}
              onClear={handleClearStrip}
              onRetake={handleRetake}
            />
          </div>
        </motion.div>
      </div>

      {flyingPhotos.map(fp => (
        <FlyingPhoto
          key={fp.id}
          src={fp.src}
          from={fp.from}
          to={fp.to}
          onComplete={() => setFlyingPhotos(prev => prev.filter(p => p.id !== fp.id))}
        />
      ))}

      <FlashAnimation isFlashing={isFlashing} onComplete={() => setIsFlashing(false)} />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        photos={photos}
        layout={layout}
        template={template}
      />
    </div>
  );
}
