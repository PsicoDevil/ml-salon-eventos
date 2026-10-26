import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/gestion/presupuestos",
        destination: "/presupuestoml",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
