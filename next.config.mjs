/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['images.unsplash.com'],
  remotePatterns: [
    {
      protocol: "https",
      hostname: "files.edgestore.dev",
      
    },
  ],
},
};

export default nextConfig;
