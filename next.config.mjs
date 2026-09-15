/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",  
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "your-backend-app-name.onrender.com", // তোমার রেন্ডারের ব্যাকএন্ড ডোমেইন এখানে বসিয়ে দিও
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;