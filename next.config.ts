import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@google-cloud/speech",
      "@google-cloud/text-to-speech",
      "@google/generative-ai",
      "three",
      "@react-three/fiber",
      "framer-motion",
      "motion"
    ],
  },
};

export default nextConfig;
