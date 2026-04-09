import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this in production for tighter security
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Add your custom socket event listeners here

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;

// This allows the file to be run dynamically natively via node or imported
if (require.main === module) {
  httpServer.listen(PORT, () => {
    console.log(`Socket.io server running on port ${PORT}`);
  });
}

export { io, httpServer };
