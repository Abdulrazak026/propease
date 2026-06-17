module.exports = {
  apps: [{
    name: "mbpp-bot",
    script: "dist/index.js",
    cwd: "/var/www/mbpp/bot",
    instances: 1,
    exec_mode: "fork",
    env: {
      NODE_ENV: "production",
      API_URL: "http://localhost:4000",
    },
    error_file: "/var/www/mbpp/logs/bot-error.log",
    out_file: "/var/www/mbpp/logs/bot-out.log",
    merge_logs: true,
    max_memory_restart: "256M",
    autorestart: true,
    watch: false,
    restart_delay: 5000,
  }],
};
