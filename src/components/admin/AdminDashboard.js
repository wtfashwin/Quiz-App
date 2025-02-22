import React, { useState, useEffect } from 'react';

import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import socket from '../../socket';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roomName, setRoomName] = useState('');
  const [activeRooms, setActiveRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for room updates
    socket.on('rooms_updated', (rooms) => {
      setActiveRooms(rooms);
    });

    // Clean up listeners
    return () => {
      socket.off('rooms_updated');
    };
  }, []);

  const createRoom = () => {
    if (!roomName.trim()) {
      setError('Please enter a room name');
      return;
    }

    socket.emit('create_room', { name: roomName, host: user.name });
    socket.once('room_created', ({ roomId }) => {
      navigate(`/quiz/${roomId}`);
    });
  };

  const startGame = (roomId) => {
    socket.emit('start_game', roomId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography color="textSecondary">
          Welcome back, {user?.name}!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Create Room Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Create New Quiz Room
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="roomName"
                label="Room Name"
                name="roomName"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                error={!!error}
                helperText={error}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={createRoom}
                sx={{ mt: 2 }}
              >
                Create Quiz Room
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Active Rooms Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Quiz Rooms
            </Typography>
            {activeRooms.length === 0 ? (
              <Typography color="textSecondary">
                No active quiz rooms at the moment
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {activeRooms.map((room) => (
                  <Grid item xs={12} key={room.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{room.name}</Typography>
                        <Typography color="textSecondary">
                          Host: {room.host}
                        </Typography>
                        <Typography>
                          Players: {room.players.length}
                        </Typography>
                        <Typography>
                          Status: {room.state}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        {room.state === 'waiting' && (
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => startGame(room.id)}
                          >
                            Start Quiz
                          </Button>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
