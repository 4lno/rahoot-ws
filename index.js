// index.js — WebSocket + Express server for Rahoot
import express from "express";
import { WebSocketServer } from "ws";

const app = express();

// Render cung cấp PORT qua biến môi trường
const PORT = process.env.PORT || 10000;

// HTTP route để Render kiểm tra
app.get("/", (req, res) => {
  res.send("✅ Rahoot WebSocket server is running and ready!");
});

// Tạo HTTP server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ HTTP server listening on port ${PORT}`);
});

// Tạo WebSocket server chia sẻ cùng HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔗 New WebSocket client connected");

  ws.on("message", (message) => {
    console.log("📩 Received:", message.toString());

    // Broadcast lại cho mọi người
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

console.log("🚀 Rahoot WebSocket Server booting...");
