// ✅ Rahoot WebSocket Server (Render-compatible)
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

const app = express();

// Render cung cấp PORT qua biến môi trường
const PORT = process.env.PORT || 10000;

// Endpoint để Render xác nhận app đang chạy
app.get("/", (req, res) => {
  res.send("✅ Rahoot WebSocket server is running on Render!");
});

// Tạo HTTP server
const server = http.createServer(app);

// Khởi tạo WebSocket server trên cùng HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔗 New client connected");

  ws.on("message", (msg) => {
    console.log("📩 Message received:", msg.toString());

    // Gửi lại tin nhắn cho tất cả client khác
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});

// Bắt đầu lắng nghe
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Rahoot WebSocket + HTTP server running on port ${PORT}`);
});
