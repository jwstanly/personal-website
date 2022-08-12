module.exports = {
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/images/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=10, stale-while-revalidate=59',
          },
        ],
      },
      {
        source: '/:slug*.(gif|jpe?g|tiff?|png|webp|bmp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=10, stale-while-revalidate=59',
          },
        ],
      },
    ];
  },
};
