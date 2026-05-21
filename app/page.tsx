'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Camera, Download, Film, ArrowRight } from 'lucide-react';
import FloatingNavbar from '@/components/FloatingNavbar';
import GlassCard from '@/components/GlassCard';
import AnimatedButton from '@/components/AnimatedButton';

const FEATURES = [
  {
    icon: <Film className="w-5 h-5" />,
    title: 'real-time filters',
    description: 'Vintage, film, pastel, and more — applied live to your camera preview.',
    accent: 'bg-pale-peach',
    rotate: '-1deg',
  },
  {
    icon: <Camera className="w-5 h-5" />,
    title: 'photo strips',
    description: 'Compose beautiful 4-shot strips that look and feel like printed memories.',
    accent: 'bg-[#E4EDE4]',
    rotate: '1.2deg',
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: 'instant export',
    description: 'One tap to download your strip as a high-quality PNG. No account needed.',
    accent: 'bg-[#E3EAF2]',
    rotate: '-0.6deg',
  },
];

const SAMPLE_STRIPS = [
  {
    label: 'vintage',
    slots: ['#D4C4A8', '#C8B898', '#CCBC9C', '#D0C0A0'],
    rotate: '-2.5deg',
    tapeRotate: '1.5deg',
    drift: 'animate-paper-drift',
  },
  {
    label: 'film',
    slots: ['#B8C8C0', '#A8BCBA', '#B0C4BC', '#BCCCCA'],
    rotate: '1.8deg',
    tapeRotate: '-1deg',
    drift: 'animate-paper-drift-2',
  },
  {
    label: 'pastel',
    slots: ['#DDD0E0', '#D4C8E0', '#D8CEDE', '#DCCEDE'],
    rotate: '-1.2deg',
    tapeRotate: '2.2deg',
    drift: 'animate-paper-drift-3',
  },
];

const TESTIMONIALS = [
  {
    name: 'Mia Chen',
    date: 'Mar 2025',
    text: 'Used this for our graduation photos. The strips look exactly like ones from vintage photobooths. I printed mine and framed it.',
    rotate: '-1.5deg',
  },
  {
    name: 'Jordan Lee',
    date: 'Feb 2025',
    text: 'The film filter makes every photo look like it was shot on 35mm. So clean, so minimal. Exactly what I was looking for.',
    rotate: '1deg',
  },
  {
    name: 'Sofia Rivera',
    date: 'Jan 2025',
    text: 'I was expecting another neon app — this is so much better. It feels like a real camera. Quiet, intentional, beautiful.',
    rotate: '-0.6deg',
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as number[] },
});

const fadeInView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as number[] },
});

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper overflow-x-hidden pb-24 md:pb-0">
      <FloatingNavbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">

          {/* Left — Copy */}
          <div className="flex-1 max-w-xl">
            <motion.h1
              {...fadeUp(0.08)}
              className="serif text-[clamp(3.2rem,8vw,7rem)] leading-[0.92] tracking-tight text-charcoal mb-8"
            >
              <span className="block font-normal">make every</span>
              <span className="block italic text-faded-brown">moment.</span>
            </motion.h1>

            <motion.p {...fadeUp(0.18)} className="text-warm-gray text-lg leading-relaxed mb-10 max-w-sm">
              An aesthetic photobooth for capturing film-quality memories. Real-time filters, beautiful strips, straight from your browser.
            </motion.p>

            <motion.div {...fadeUp(0.26)} className="flex flex-col sm:flex-row gap-3">
              <Link href="/booth">
                <AnimatedButton variant="ink" size="lg" className="group">
                  <Camera className="w-4 h-4" />
                  start taking photos
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </AnimatedButton>
              </Link>
              <AnimatedButton variant="warm" size="lg">
                see filters
              </AnimatedButton>
            </motion.div>

            {/* Subtle stat row */}
            <motion.div {...fadeUp(0.34)} className="flex items-center gap-6 mt-12">
              {[['10', 'filters'], ['3', 'layouts'], ['1-tap', 'export']].map(([num, label]) => (
                <div key={label}>
                  <p className="font-serif text-2xl text-charcoal">{num}</p>
                  <p className="text-xs text-warm-gray tracking-wide">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Floating photo strips */}
          <div className="flex-shrink-0 hidden lg:flex items-end gap-5 pb-8">
            {SAMPLE_STRIPS.map((strip, i) => (
              <motion.div
                key={strip.label}
                className={strip.drift}
                style={{ rotate: strip.rotate }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}
              >
                <div className="relative bg-white rounded-sm shadow-photo" style={{ width: '110px', padding: '8px 8px 14px' }}>
                  {/* Masking tape */}
                  <div
                    className="tape-strip"
                    style={{
                      top: '-10px',
                      left: '50%',
                      transform: `translateX(-50%) rotate(${strip.tapeRotate})`,
                    }}
                  />
                  {/* Photo slots */}
                  <div className="flex flex-col gap-1.5">
                    {strip.slots.map((color, j) => (
                      <div
                        key={j}
                        className="w-full rounded-[2px]"
                        style={{ aspectRatio: '4/3', background: color, opacity: 0.75 + j * 0.06 }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-[9px] text-warm-gray font-medium mt-2 tracking-widest uppercase">
                    {strip.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Subtle cream shape */}
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #EFE8DD 0%, transparent 70%)', opacity: 0.6 }}
        />
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-28 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInView()} className="mb-16">
            <h2 className="serif text-4xl md:text-5xl text-charcoal leading-tight">
              everything you need<br />
              <span className="italic text-faded-brown">to look amazing.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                {...fadeInView(index * 0.1)}
                style={{ rotate: feature.rotate }}
              >
                <GlassCard padding="lg" delay={0} rotate={undefined}>
                  <div className={`w-11 h-11 ${feature.accent} rounded-xl flex items-center justify-center mb-5 text-charcoal`}>
                    {feature.icon}
                  </div>
                  <h3 className="serif text-xl text-charcoal mb-3 font-normal">{feature.title}</h3>
                  <p className="text-warm-gray text-sm leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SAMPLE STRIPS — scrapboard ===== */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInView()} className="text-center mb-20">
            <h2 className="serif text-4xl md:text-5xl text-charcoal">
              10 moods, one click.
            </h2>
            <p className="text-warm-gray mt-4 max-w-md mx-auto text-sm leading-relaxed">
              Each filter is tuned to bring a distinct feeling — from warm 35mm film to cool silver gelatin prints.
            </p>
          </motion.div>

          {/* Scrapboard — overlapping polaroid style */}
          <div className="relative flex items-center justify-center min-h-[420px]">
            {SAMPLE_STRIPS.map((strip, index) => {
              const offsets = ['-120px', '0px', '120px'];
              const zIndexes = [1, 3, 2];
              return (
                <motion.div
                  key={strip.label}
                  initial={{ opacity: 0, y: 30, rotate: strip.rotate }}
                  whileInView={{ opacity: 1, y: 0, rotate: strip.rotate }}
                  whileHover={{ y: -12, zIndex: 10, transition: { duration: 0.25 } }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className="absolute cursor-pointer"
                  style={{
                    left: `calc(50% + ${offsets[index]})`,
                    transform: `translateX(-50%)`,
                    zIndex: zIndexes[index],
                  }}
                >
                  <div className="relative bg-white rounded-sm shadow-card-lg" style={{ width: '160px', padding: '10px 10px 20px' }}>
                    <div
                      className="tape-strip"
                      style={{
                        top: '-10px',
                        left: '50%',
                        transform: `translateX(-50%) rotate(${strip.tapeRotate})`,
                        width: '64px',
                      }}
                    />
                    <div className="flex flex-col gap-2">
                      {strip.slots.map((color, j) => (
                        <div
                          key={j}
                          className="w-full rounded-[2px]"
                          style={{ aspectRatio: '4/3', background: color }}
                        />
                      ))}
                    </div>
                    <p className="text-center text-[10px] text-warm-gray font-medium mt-3 tracking-widest uppercase">
                      {strip.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-28 px-6 bg-cream">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeInView()} className="mb-16">
            <h2 className="serif text-4xl md:text-5xl text-charcoal">
              people love<br />
              <span className="italic">their memories.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                style={{ rotate: t.rotate }}
              >
                <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-card">
                  {/* Quote mark */}
                  <p className="serif text-4xl text-faded-brown/40 leading-none mb-3">&ldquo;</p>
                  <p className="text-charcoal/80 text-sm leading-relaxed mb-6">{t.text}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-charcoal font-semibold text-sm">{t.name}</p>
                    </div>
                    <p className="text-warm-gray text-xs">{t.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-charcoal rounded-3xl p-14 md:p-20 overflow-hidden text-center"
          >
            {/* Subtle warm glow inside dark card */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 120%, rgba(155,126,106,0.12) 0%, transparent 65%)',
              }}
            />

            <motion.div
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="serif text-5xl mb-6 inline-block"
              aria-hidden
            >
              📸
            </motion.div>

            <h2 className="serif text-4xl md:text-5xl text-paper mb-5 font-normal">
              ready to snap?
            </h2>
            <p className="text-paper/50 text-sm mb-10 max-w-xs mx-auto leading-relaxed">
              Open your camera, pick a filter, and create photo memories that look like art.
            </p>

            <Link href="/booth">
              <AnimatedButton variant="warm" size="xl" className="group">
                <Camera className="w-4 h-4" />
                open shuttrbooth
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#E5E0D8] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="serif text-charcoal">ShuttrBooth</span>
          </div>

          <p className="text-warm-gray text-xs">
            made for aesthetic memories · {new Date().getFullYear()}
          </p>

          <div className="flex items-center gap-5">
            <Link href="/booth" className="text-warm-gray hover:text-charcoal text-xs transition-colors">
              booth
            </Link>
            <span className="text-[#D5CCB8]">·</span>
            <span className="text-warm-gray text-xs">free to use</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
