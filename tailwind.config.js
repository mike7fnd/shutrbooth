/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F8F6F2',
        cream: '#EFE8DD',
        charcoal: '#1E1E1E',
        'warm-gray': '#7A7A7A',
        sage: '#8A9E8A',
        'dusty-blue': '#8EA3B8',
        'faded-brown': '#9B7E6A',
        'pale-peach': '#F2D9C8',
        tape: '#F0E6C0',
        ink: '#2C2C2C',
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        card: '0 2px 12px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)',
        'card-lg': '0 6px 28px rgba(0,0,0,0.11), 0 2px 8px rgba(0,0,0,0.06)',
        lifted: '0 10px 40px rgba(0,0,0,0.14), 0 3px 10px rgba(0,0,0,0.07)',
        tape: '1px 2px 5px rgba(0,0,0,0.10)',
        inner: 'inset 0 1px 3px rgba(0,0,0,0.06)',
        photo: '0 3px 14px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.08)',
      },
      animation: {
        'paper-drift': 'paperDrift 8s ease-in-out infinite',
        'paper-drift-2': 'paperDrift2 10s ease-in-out infinite',
        'paper-drift-3': 'paperDrift3 12s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out both',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        paperDrift: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-1.5deg)' },
          '50%': { transform: 'translateY(-7px) rotate(-1.1deg)' },
        },
        paperDrift2: {
          '0%, 100%': { transform: 'translateY(0px) rotate(1.2deg)' },
          '50%': { transform: 'translateY(-5px) rotate(1.6deg)' },
        },
        paperDrift3: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-0.8deg)' },
          '50%': { transform: 'translateY(-9px) rotate(-0.4deg)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
