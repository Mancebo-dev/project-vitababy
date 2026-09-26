module.exports = {
  apps: [
    {
      name: "vitababy-app",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
