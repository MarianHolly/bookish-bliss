import('next').NextConfig

import withPlaiceholder from "@plaiceholder/next";

const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
};

export default withPlaiceholder(nextConfig);
