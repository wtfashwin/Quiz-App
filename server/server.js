const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (replace with a database in production)
const users = new Map();
const rooms = new Map();
const activeGames = new Map();

// Admin credentials (move to environment variables in production)
const ADMIN_EMAIL = 'abc@test.in';
const ADMIN_PASSWORD = '123';

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({
      id: 'admin-id',
      email,
      name: 'Admin',
      role: 'admin'
    });
  }

  // For demo purposes, auto-create user if not exists
  if (!users.has(email)) {
    users.set(email, {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      role: 'player'
    });
  }

  const user = users.get(email);
  res.json(user);
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (users.has(email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const user = {
    id: `user-${Date.now()}`,
    email,
    name,
    role: 'player'
  };

  users.set(email, user);
  res.json(user);
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('New client connected');
  let currentUser = null;
  let currentRoom = null;

  socket.on('authenticate', ({ user }) => {
    currentUser = user;
    socket.emit('authenticated', { user });
  });

  socket.on('create_room', ({ name, host }) => {
    const roomId = `room-${Date.now()}`;
    const room = {
      id: roomId,
      name,
      host,
      players: [],
      state: 'waiting',
      questions: generateQuestions(),
      scores: new Map()
    };

    rooms.set(roomId, room);
    socket.join(roomId);
    currentRoom = roomId;
    
    socket.emit('room_created', { roomId });
    io.emit('rooms_updated', Array.from(rooms.values()));
  });

  socket.on('join_room', ({ roomId, player }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.state !== 'waiting') {
      socket.emit('error', { message: 'Game already in progress' });
      return;
    }

    socket.join(roomId);
    currentRoom = roomId;
    room.players.push(player);
    room.scores.set(player.id, 0);

    socket.emit('room_joined', room);
    io.to(roomId).emit('player_joined', { player });
    io.emit('rooms_updated', Array.from(rooms.values()));
  });

  socket.on('start_game', (roomId) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }

    if (currentUser?.role !== 'admin') {
      socket.emit('error', 'Only admin can start the game');
      return;
    }

    room.state = 'playing';
    
    io.to(roomId).emit('game_started', {
      question: room.questions[0],
      players: room.players
    });
  });

  socket.on('submit_answer', ({ roomId, answer, username }) => {
    const room = rooms.get(roomId);
    
    if (!room || room.state !== 'playing') {
      return;
    }

    // Implement answer checking and scoring logic here
    const currentScore = room.scores.get(username) || 0;
    room.scores.set(username, currentScore + 10); // Example scoring

    io.to(roomId).emit('scores_updated', {
      scores: Array.from(room.scores.entries())
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (currentRoom) {
      const room = rooms.get(currentRoom);
      if (room && currentUser) {
        room.players = room.players.filter(p => p !== currentUser.name);
        if (room.players.length === 0) {
          rooms.delete(currentRoom);
        } else {
          io.to(currentRoom).emit('player_left', {
            username: currentUser.name,
            players: room.players
          });
        }
      }
    }
  });
});

function generateQuestions() {
  return [
    {
      id: 1,
      question: "What is Python?",
      options: [
        "A programming language",
        "A snake",
        "A text editor",
        "An operating system"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "Which of these is not a Python data type?",
      options: [
        "Integer",
        "Float",
        "String",
        "Character"
      ],
      correctAnswer: 3
    },
    {
      id: 3,
      question: "What is the result of 2 ** 3 in Python?",
      options: [
        "6",
        "8",
        "5",
        "9"
      ],
      correctAnswer: 1
    }
  ];
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
