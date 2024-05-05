module.exports = {
  apps: [
    {
      name: "my-app",
      script: "src/index.ts",
      interpreter: "ts-node",
      exec_mode: "fork",
      instances: 1,
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        watch: false,
      },
    },
  ],
};
