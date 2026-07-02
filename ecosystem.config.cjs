/** PM2 — start with: pm2 start ecosystem.config.cjs && pm2 save */
module.exports = {
  apps: [
    {
      name: "thegoalposts",
      cwd: "/var/www/thegoalposts",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      interpreter: "node",
      env_file: "/var/www/thegoalposts/.env.production",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NODE_OPTIONS: "--max-old-space-size=512",
        DISABLE_SENTRY_TUNNEL: "1",
      },
    },
  ],
};
