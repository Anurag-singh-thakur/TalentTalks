const express = require('express');
const router = express.Router();

const rooms = new Map(); 

router.post('/create-token', async (req, res) => {
  try {
    const { userId } = req.body;
   
    const token = Math.random().toString(36).substring(2);

    res.json({ token });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ message: 'Error generating token', error: error.message });
  }
});

router.post('/create-room', async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        host: userId,
        participants: new Set([userId]),
        createdAt: new Date()
      });
    }

    res.json({ 
      roomId,
      userId,
      message: 'Room created successfully'
    });
  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({ message: 'Error creating room', error: error.message });
  }
});

module.exports = router;
