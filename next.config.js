const withPWA = require('@ducanh2912/next-pwa').default;

module.exports = withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
  fallbackRoutes: {
    document: '/offline',
  },
})({
  reactStrictMode: true,
});
