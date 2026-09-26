const { Server } = require("socket.io");

const setupSignaling = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-room", ({ roomId }) => {
      if (!roomId) return;

      const room = io.sockets.adapter.rooms.get(roomId);
      const usersInRoom = room ? room.size : 0;

      socket.join(roomId);

      console.log(`${socket.id} joined room ${roomId}`);

      if (usersInRoom === 0) {
        socket.emit("room-created");
      } else {
        socket.emit("room-joined");

        socket.to(roomId).emit("user-joined", {
          socketId: socket.id,
        });
      }
    });

    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", {
        offer,
      });
    });

    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", {
        answer,
      });
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", {
        candidate,
      });
    });

    socket.on("leave-room", ({ roomId }) => {
      socket.to(roomId).emit("user-left");
      socket.leave(roomId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = setupSignaling;