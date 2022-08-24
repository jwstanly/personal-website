const cacheHeaders = {
  key: 'Cache-Control',
  value: 'public, s-maxage=10, stale-while-revalidate=59',
};

module.exports = {
  swcMinify: true,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  async headers() {
    return [
      {
        source: '/images/:slug*',
        headers: [cacheHeaders],
      },
      {
        source: '/:slug*.(gif|jpe?g|tiff?|png|webp|bmp)',
        headers: [cacheHeaders],
      },
    ];
  },
};
