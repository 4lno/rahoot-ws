import express from "express";
import { WebSocketServer } from "ws";

const app = express();

// Render cung cấp PORT qua biến môi trường
const PORT = process.env.PORT || 5505;

// Khởi tạo server HTTP
const server = app.listen(PORT, () => {
  console.log(`✅ Rahoot WebSocket Server running on port ${PORT}`);
});

// Tạo WebSocket server trên cùng server HTTP
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔗 New client connected");

  ws.on("message", (msg) => {
    console.log("📩 Message received:", msg.toString());
    // Gửi lại cho tất cả client khác
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

// Route kiểm tra
app.get("/", (req, res) => {
  res.send("✅ Rahoot WebSocket server is running!");
});
