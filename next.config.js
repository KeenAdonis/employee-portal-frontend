/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [

            // LOCAL LARAVEL STORAGE
            {
                protocol: "http",
                hostname: "localhost",
                port: "8000",
                pathname: "/storage/**",
            },

            // VPS / PRODUCTION DOMAIN
            {
                protocol: "https",
                hostname: "psie-portal.psi-services.cloud",
                pathname: "/storage/**",
            },

        ],
    },
};

module.exports = nextConfig;