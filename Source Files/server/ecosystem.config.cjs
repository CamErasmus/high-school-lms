module.exports = {
  apps: [
    {
      name: "DemoBackend1",
      script: "server.js",
      env: {
        PORT: 3001
      },
      watch: true,
      instances: 1,
      exec_mode: "cluster"
    },
    {
      name: "DemoBackend2",
      script: "server.js",
      env: {
        PORT: 3002
      },
      watch: true,
      instances: 1,
      exec_mode: "cluster"
    },
    {
      name: "DemoBackend3",
      script: "server.js",
      env: {
        PORT: 3003
      },
      watch: true,
      instances: 1,
      exec_mode: "cluster"
    }
  ]
};


