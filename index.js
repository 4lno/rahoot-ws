
import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const PORT = process.env.PORT || 10000;

// Route test để Render phát hiện HTTP
app.get("/", (req, res) => {
  res.status(200).send("✅ Rahoot WebSocket server is alive!");
});

// Tạo server HTTP thật
const server = http.createServer(app);

// Gắn WebSocket vào cùng server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔗 Client connected");

  ws.on("message", (message) => {
    console.log("📩 Received:", message.toString());
    for (const client of wss.clients) {
      if (client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    }
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});

// Bắt buộc phải listen như sau:
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
});
