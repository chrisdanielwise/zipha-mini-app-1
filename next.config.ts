// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    RENDER_TOKEN: process.env.RENDER_TOKEN,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    RENDER_OWNER_TOKEN: process.env.RENDER_OWNER_TOKEN,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    TELEGRAM_API_ID: process.env.TELEGRAM_API_ID,
    TELEGRAM_API_HASH: process.env.TELEGRAM_API_HASH,
    TELEGRAM_SESSION: process.env.TELEGRAM_SESSION,
    USER_ID: process.env.USER_ID
  },
}

export default nextConfig;