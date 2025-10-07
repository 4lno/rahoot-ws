// ✅ Rahoot WebSocket Server (Render-compatible)
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

// === Cấu hình ===
const PORT = process.env.PORT || 10000;

// === Tạo server HTTP cơ bản (Render bắt buộc) ===
const app = express();
app.get("/", (req, res) => {
  res.send("✅ Rahoot WebSocket server is running!");
});

// === Khởi tạo WebSocket ===
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// === Danh sách phòng & người chơi ===
let rooms = {};

// === Xử lý kết nối ===
wss.on("connection", (ws) => {
  console.log("🔗 Client connected");

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);

      switch (msg.type) {
        case "CREATE_ROOM":
          const roomId = Math.random().toString(36).substr(2, 6);
          rooms[roomId] = { manager: ws, players: [] };
          ws.send(JSON.stringify({ type: "ROOM_CREATED", roomId }));
          console.log(`🎮 Room created: ${roomId}`);
          break;

        case "JOIN_ROOM":
          const room = rooms[msg.roomId];
          if (room) {
            room.players.push(ws);
            ws.send(JSON.stringify({ type: "JOIN_SUCCESS", roomId: msg.roomId }));
            console.log(`👤 Player joined room ${msg.roomId}`);
          } else {
            ws.send(JSON.stringify({ type: "ERROR", message: "Room not found" }));
          }
          break;

        case "BROADCAST":
          if (msg.roomId && rooms[msg.roomId]) {
            rooms[msg.roomId].players.forEach((p) => {
              if (p.readyState === 1) p.send(JSON.stringify(msg.data));
            });
          }
          break;

        default:
          console.log("⚙ Unknown message type:", msg.type);
      }
    } catch (err) {
      console.error("❌ Error parsing message:", err);
    }
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});

// === Chạy server ===
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ WebSocket + HTTP server running on port ${PORT}`);
});
