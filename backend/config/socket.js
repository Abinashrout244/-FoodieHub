const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173", // Customer frontend
        "http://localhost:5174", // Admin frontend - change if needed
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authenticate socket using JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error.message);
      next(new Error("Invalid or expired token"));
    }
  });

  // Single connection handler
  io.on("connection", (socket) => {
    const user = socket.user;

    // Private room for each user
    socket.join(`user:${user._id}`);

    // Admin room
    if (user.role === "admin") {
      socket.join("admins");

      console.log("ADMIN JOINED ADMINS ROOM:", user.email);
    } else {
      console.log("CUSTOMER CONNECTED:", user.email);
      console.log("USER ROLE:", user.role);
    }

    console.log("CONNECTED SOCKET:", socket.id);

    socket.on("disconnect", () => {
      console.log("SOCKET DISCONNECTED:", user.email);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};

module.exports = { initializeSocket, getIO };
