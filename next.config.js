/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: { unoptimized: true },
    output: 'export',
    trailingSlash: true,
    basePath: process.env.NODE_ENV === 'production' ? '/temp-poker-app' : '',
};

module.exports = nextConfig;
