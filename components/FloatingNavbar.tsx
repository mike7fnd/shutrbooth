'use client';

import { motion } from 'framer-motion';
import { Camera, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingNavbar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop: top floating pill (md+) ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block fixed top-4 left-0 right-0 z-50 px-4"
      >
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md border border-[#E5E0D8] rounded-2xl shadow-card flex items-center justify-between px-6 py-3 w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <span className="font-serif text-charcoal text-lg font-normal tracking-tight">
                ShuttrBooth
              </span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-1">
              <NavLink href="/" active={pathname === '/'}>home</NavLink>
              <NavLink href="/booth" active={pathname === '/booth'}>booth</NavLink>
            </div>

            {/* CTA */}
            <Link href="/booth">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-charcoal text-paper text-xs font-semibold px-4 py-2 rounded-lg shadow-card hover:shadow-lifted transition-all duration-200"
              >
                <Camera className="w-3 h-3" />
                open booth
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile: bottom tab bar (below md) ── */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-[#E5E0D8] shadow-lifted px-6 py-3">
          <div className="flex items-center justify-around max-w-sm mx-auto">
            <BottomTab href="/" active={pathname === '/'} icon={<Home className="w-5 h-5" />} label="home" />
            <BottomTab href="/booth" active={pathname === '/booth'} icon={<Camera className="w-5 h-5" />} label="booth" />
          </div>
        </div>
      </motion.nav>
    </>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.span
        whileHover={{ scale: 1.03 }}
        className={`px-4 py-1.5 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
          active ? 'bg-cream text-charcoal font-semibold' : 'text-warm-gray hover:text-charcoal hover:bg-cream/60'
        }`}
      >
        {children}
      </motion.span>
    </Link>
  );
}

function BottomTab({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link href={href} className="flex-1 flex justify-center">
      <motion.div
        whileTap={{ scale: 0.92 }}
        className="flex flex-col items-center gap-1 px-6 py-1"
      >
        <div
          className={`w-12 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
            active ? 'bg-charcoal text-paper' : 'text-warm-gray'
          }`}
        >
          {icon}
        </div>
        <span
          className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
            active ? 'text-charcoal' : 'text-warm-gray'
          }`}
        >
          {label}
        </span>
      </motion.div>
    </Link>
  );
}
