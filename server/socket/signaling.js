const { Server } = require("socket.io");

const setupSignaling = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    /* =========================
       JOIN ROOM
    ========================= */

    socket.on("join-room", ({ roomId }) => {
      if (!roomId) {
        console.log("❌ Room ID missing");
        return;
      }

      const room = io.sockets.adapter.rooms.get(roomId);
      const usersInRoom = room ? room.size : 0;

      socket.data.roomId = roomId;

      socket.join(roomId);

      console.log(
        `🚪 ${socket.id} joined room ${roomId} | Existing users: ${usersInRoom}`
      );

      if (usersInRoom === 0) {
        socket.emit("room-created");

        console.log(`🟢 Room created: ${roomId}`);
      } else {
        socket.emit("room-joined");

        socket.to(roomId).emit("user-joined", {
          socketId: socket.id,
        });

        console.log(`👤 User joined existing room: ${roomId}`);
      }
    });

    /* =========================
       OFFER
    ========================= */

    socket.on("offer", ({ roomId, offer }) => {
      if (!roomId || !offer) return;

      console.log(`📤 Offer from ${socket.id} → room ${roomId}`);

      socket.to(roomId).emit("offer", {
        offer,
        socketId: socket.id,
      });
    });

    /* =========================
       ANSWER
    ========================= */

    socket.on("answer", ({ roomId, answer }) => {
      if (!roomId || !answer) return;

      console.log(`📥 Answer from ${socket.id} → room ${roomId}`);

      socket.to(roomId).emit("answer", {
        answer,
        socketId: socket.id,
      });
    });

    /* =========================
       ICE CANDIDATE
    ========================= */

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      if (!roomId || !candidate) return;

      socket.to(roomId).emit("ice-candidate", {
        candidate,
        socketId: socket.id,
      });
    });

    /* =========================
       LEAVE ROOM
    ========================= */

    socket.on("leave-room", ({ roomId }) => {
      if (!roomId) return;

      console.log(`👋 ${socket.id} leaving room ${roomId}`);

      socket.to(roomId).emit("user-left");

      socket.leave(roomId);

      if (socket.data.roomId === roomId) {
        socket.data.roomId = null;
      }
    });

    /* =========================
       DISCONNECT
    ========================= */

    socket.on("disconnect", (reason) => {
      const roomId = socket.data.roomId;

      console.log(
        `🔌 Socket disconnected: ${socket.id} | Reason: ${reason}`
      );

      if (roomId) {
        socket.to(roomId).emit("user-left");

        console.log(
          `👋 Notified room ${roomId} that ${socket.id} left`
        );
      }
    });
  });

  return io;
};

module.exports = setupSignaling;