// @ts-check
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? (await import('@next/bundle-analyzer')).default({
      enabled: true,
    })
  : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  // Enable compression for better performance
  compress: true,
  // Optimize for production
  productionBrowserSourceMaps: false,
  // ISR configuration
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default withBundleAnalyzer(nextConfig);
