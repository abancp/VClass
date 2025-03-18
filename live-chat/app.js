import { WebSocketServer } from "ws";
import express from "express";
import { createServer } from "http";
import { createClient } from "redis";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Create Redis publisher and subscriber
const pubClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });
const subClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` });

pubClient.on("error", (err) => console.error("❌ Redis Publisher Error:", err));
subClient.on("error", (err) => console.error("❌ Redis Subscriber Error:", err));

// Connect Redis clients
await pubClient.connect();
await subClient.connect();
console.log("✅ Redis Connected");

// Subscribe to Redis channel
await subClient.subscribe("live-chat", (message) => {
  console.log("📩 Received from Redis:", message);

  // Broadcast message to all connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {  // WebSocket.OPEN
      client.send(message);
    }
  });
});

wss.on("connection", (ws) => {
  console.log("✅ New WebSocket client connected");

  ws.on("message", async (message) => {
    try {
      const msg = JSON.parse(message);

      if (msg.type === "chat") {
        const chatMessage = {
          user: msg.user,
          message: msg.text,
          room: msg.room,
          timestamp: Date.now(),
        };

        // Publish chat message to Redis
        await pubClient.publish("live-chat", JSON.stringify(chatMessage));
      }
    } catch (error) {
      console.error("❌ Error processing message:", error);
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

const PORT = process.env.PORT || 8082;
server.listen(PORT, () => {
  console.log(`🚀 Live Chat Server running on ws://localhost:${PORT}`);
});
