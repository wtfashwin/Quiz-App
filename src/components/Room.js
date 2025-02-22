import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import socket from '../socket';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [scores, setScores] = useState(new Map());

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Join room
    socket.emit('join_room', { roomId, username: user.name });

    // Socket event listeners
    socket.on('room_joined', (roomData) => {
      setRoom(roomData);
      setLoading(false);
    });

    socket.on('player_joined', ({ username, players }) => {
      setRoom(prev => ({ ...prev, players }));
    });

    socket.on('player_left', ({ username, players }) => {
      setRoom(prev => ({ ...prev, players }));
    });

    socket.on('game_started', ({ question }) => {
      setGameStarted(true);
      setCurrentQuestion(question);
    });

    socket.on('scores_updated', ({ scores }) => {
      setScores(new Map(scores));
    });

    socket.on('error', (errorMessage) => {
      setError(errorMessage);
      setLoading(false);
    });

    // Cleanup
    return () => {
      socket.off('room_joined');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('game_started');
      socket.off('scores_updated');
      socket.off('error');
    };
  }, [roomId, user, navigate]);

  const startGame = () => {
    socket.emit('start_game', roomId);
  };

  const submitAnswer = (answer) => {
    socket.emit('submit_answer', {
      roomId,
      answer,
      username: user.name,
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Room: {room?.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Players
            </Typography>
            <List>
              {room?.players.map((player, index) => (
                <React.Fragment key={player}>
                  <ListItem>
                    <ListItemText
                      primary={player}
                      secondary={`Score: ${scores.get(player) || 0}`}
                    />
                  </ListItem>
                  {index < room.players.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          <Paper sx={{ p: 2, flex: 2 }}>
            {!gameStarted ? (
              <Box sx={{ textAlign: 'center' }}>
                {user?.role === 'admin' ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={startGame}
                    size="large"
                  >
                    Start Game
                  </Button>
                ) : (
                  <Typography>
                    Waiting for admin to start the game...
                  </Typography>
                )}
              </Box>
            ) : (
              currentQuestion && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {currentQuestion.question}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outlined"
                        onClick={() => submitAnswer(index)}
                      >
                        {option}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )
            )}
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default Room;
