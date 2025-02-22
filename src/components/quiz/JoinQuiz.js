import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import socket from '../../socket';

const JoinQuiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [availableRooms, setAvailableRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for room updates
    socket.on('rooms_updated', (rooms) => {
      // Only show rooms that are in waiting state
      setAvailableRooms(rooms.filter(room => room.state === 'waiting'));
    });

    socket.on('error', ({ message }) => {
      setError(message);
    });

    socket.on('room_joined', (room) => {
      navigate(`/quiz/${room.id}`);
    });

    // Request current rooms when component mounts
    socket.emit('get_rooms');

    // Clean up listeners
    return () => {
      socket.off('rooms_updated');
      socket.off('error');
      socket.off('room_joined');
    };
  }, [navigate]);

  const joinRoom = (roomId) => {
    socket.emit('join_room', {
      roomId,
      player: {
        id: user.id,
        name: user.name,
      },
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Join a Quiz
        </Typography>
        <Typography color="textSecondary">
          Select an available quiz room to join
        </Typography>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {availableRooms.length === 0 ? (
          <Grid item xs={12}>
            <Typography color="textSecondary">
              No quiz rooms available at the moment. Please wait for an admin to create one.
            </Typography>
          </Grid>
        ) : (
          availableRooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{room.name}</Typography>
                  <Typography color="textSecondary">
                    Host: {room.host}
                  </Typography>
                  <Typography>
                    Players: {room.players.length}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => joinRoom(room.id)}
                  >
                    Join Quiz
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default JoinQuiz;
