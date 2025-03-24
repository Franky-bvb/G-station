// 简单的Express服务器，用于预览网站
const express = require('express');
const path = require('path');
const app = express();
let port = process.env.PORT || 5000;

// 启用CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 提供静态文件
app.use(express.static(path.join(__dirname, 'dist')));

// 所有路由都指向index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 尝试启动服务器，如果端口被占用则尝试下一个端口
function startServer(attemptPort) {
  const server = app.listen(attemptPort)
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`端口 ${attemptPort} 已被占用，尝试端口 ${attemptPort + 1}...`);
        startServer(attemptPort + 1);
      } else {
        console.error('启动服务器时出错:', err);
      }
    })
    .on('listening', () => {
      port = attemptPort;
      console.log(`预览服务器运行在 http://localhost:${port}`);
      console.log(`您也可以尝试 http://127.0.0.1:${port}`);
      console.log(`\n可用游戏页面:`);
      console.log(`- Train Miner: http://localhost:${port}/games/action/train-miner.html`);
      console.log(`- Rise Up: http://localhost:${port}/games/action/rise-up.html`);
      console.log(`- Stickman Games: http://localhost:${port}/games/puzzle/Stickman Games.html`);
    });
}

// 启动服务器
startServer(port); 