import { WebSocketServer } from "ws";
import http from "http";

const port = process.env.PORT || 5505;
const server = http.createServer();
const wss = new WebSocketServer({ server });

let rooms = {};

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === "create_room") {
        const roomId = Math.floor(100000 + Math.random() * 900000);
        rooms[roomId] = { manager: ws, players: [] };
        ws.send(JSON.stringify({ type: "room_created", roomId }));
      } else if (data.type === "join_room") {
        const room = rooms[data.roomId];
        if (room) {
          room.players.push(ws);
          ws.send(JSON.stringify({ type: "joined", roomId: data.roomId }));
        } else {
          ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
        }
      }
    } catch (e) {
      console.error("Error:", e);
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`✅ WebSocket server running on ${port}`));
