import WebSocket from "ws";
import http from "http";

const PORT = process.env.PORT || 10000;

// tạo server HTTP (Render cần mở port HTTP để kiểm tra)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("WebSocket Server is running!");
});

// tạo WebSocket server dựa trên HTTP server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.send("Welcome to WebSocket server!");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
  });

  ws.on("close", () => console.log("Client disconnected"));
});

server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on port ${PORT}`);
});
