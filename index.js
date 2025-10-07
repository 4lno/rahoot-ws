const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 10000;

// ✅ Tạo HTTP server "dummy" để Render nhận thấy có port mở
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('WebSocket server is running ✅');
});

// ✅ Gắn WebSocket vào cùng server này
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('🔗 Client connected');
  ws.on('message', (message) => {
    console.log('📨 Received:', message.toString());
    ws.send(`Server got: ${message}`);
  });
  ws.on('close', () => console.log('❌ Client disconnected'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ WebSocket + HTTP server running on port ${PORT}`);
});
