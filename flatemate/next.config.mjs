/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['wrqsclbtasitdvvmyvqp.supabase.co'],
      },
      webpack: (config) => {
        config.resolve.extensions.push('.ts', '.tsx', '.js', '.jsx');
        return config;
      },
};

export default nextConfig;
