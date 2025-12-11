#!/usr/bin/env node
const { spawn } = require('child_process');
const { join } = require('path');

// 解析命令行参数
const args = process.argv.slice(2);
let host = 'localhost';
let port = 3000;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--host' && args[i + 1]) {
    host = args[i + 1];
    i++;
  } else if (args[i] === '--port' && args[i + 1]) {
    port = parseInt(args[i + 1], 10);
    i++;
  }
}

// 设置环境变量并启动 browser-sync
process.env.HOST = host;
process.env.PORT = port.toString();

const bsPath = join(__dirname, '..', 'node_modules', '.bin', 'browser-sync');
const bsProcess = spawn(bsPath, ['start', '--config', 'bs.config.ts'], {
  stdio: 'inherit',
  env: process.env
});

bsProcess.on('exit', (code) => {
  process.exit(code || 0);
});

