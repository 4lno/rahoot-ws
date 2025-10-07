// index.js
const WebSocket = require("ws");
const http = require("http");

const PORT = process.env.PORT || 10000;

// ✅ Tạo server HTTP để Render nhận thấy port đang mở
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("✅ Rahoot WebSocket server is running.\n");
});

// ✅ Khởi tạo WebSocket server trên cùng cổng
const wss = new WebSocket.Server({ server });

// Xử lý sự kiện khi có client kết nối
wss.on("connection", (ws) => {
  console.log("🔗 Client connected");

  ws.on("message", (msg) => {
    console.log("📨 Received:", msg.toString());
    ws.send(`Server got: ${msg}`);
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ HTTP + WebSocket server is running on port ${PORT}`);
});
