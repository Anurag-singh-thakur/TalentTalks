require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/db');
const profile = require('./routes/profile');
const cors = require('cors');
const roomRoutes = require('./routes/room'); 
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
    origin: 'http://localhost:5173',
}));
app.use(bodyParser.json());

connectDB();
app.use('/auth', authRoutes);
app.use('/profile', require('./routes/profile'));
app.use('/room', roomRoutes); 

// Socket.IO connection handling
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('end-room', (roomId) => {
      io.to(roomId).emit('room-ended');
    });

    socket.on('leave-room', (roomId) => {
      socket.to(roomId).emit('user-disconnected', userId);
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});