// ✅ Rahoot WebSocket Server (Render-Ready)
import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();

// PORT phải dùng từ Render
const PORT = process.env.PORT || 10000;

// Route kiểm tra để Render nhận diện HTTP port
app.get("/", (req, res) => {
  res.status(200).send("✅ Rahoot WebSocket server is alive!");
});

// Tạo HTTP server từ Express
const server = http.createServer(app);

// Tạo WebSocket server dùng chung HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔗 New client connected");

  ws.on("message", (message) => {
    console.log("📩 Received:", message.toString());

    // Gửi lại tin nhắn cho mọi client khác
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

// Quan trọng: lắng nghe đúng cổng và host
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
  console.log("✅ WebSocket ready on the same port");
});
