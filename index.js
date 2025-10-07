import { WebSocketServer } from "ws";
import http from "http";

const PORT = process.env.PORT || 10000;

// Tạo server HTTP (Render yêu cầu có HTTP port để xác nhận service đang chạy)
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("✅ WebSocket Server is running!");
});

// Tạo WebSocket server dựa trên HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected ✅");
  ws.send("Welcome to the WebSocket server!");

  ws.on("message", (message) => {
    console.log("📩 Received:", message.toString());
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
});
