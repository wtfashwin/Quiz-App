import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import socket from '../../socket';

const Quiz = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [scores, setScores] = useState(new Map());
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    socket.on('game_started', ({ question }) => {
      setCurrentQuestion(question);
      setTimeLeft(30); // 30 seconds per question
    });

    socket.on('next_question', ({ question }) => {
      setCurrentQuestion(question);
      setSelectedAnswer('');
      setTimeLeft(30);
    });

    socket.on('game_ended', ({ finalScores }) => {
      setScores(new Map(Object.entries(finalScores)));
      setCurrentQuestion(null);
    });

    socket.on('scores_updated', ({ scores: newScores }) => {
      setScores(new Map(Object.entries(newScores)));
    });

    socket.on('error', ({ message }) => {
      setError(message);
    });

    // Request room info when component mounts
    socket.emit('get_room', roomId);

    // Clean up listeners
    return () => {
      socket.off('game_started');
      socket.off('next_question');
      socket.off('game_ended');
      socket.off('scores_updated');
      socket.off('error');
    };
  }, [roomId]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && currentQuestion) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      submitAnswer();
    }
    return () => clearInterval(timer);
  }, [timeLeft, currentQuestion]);

  const submitAnswer = () => {
    if (currentQuestion && selectedAnswer !== '') {
      socket.emit('submit_answer', {
        roomId,
        questionId: currentQuestion.id,
        answer: parseInt(selectedAnswer),
      });
    }
  };

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate('/')} color="primary">
          Return Home
        </Button>
      </Container>
    );
  }

  if (!room && !currentQuestion) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {currentQuestion ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Time Left: {timeLeft} seconds
                </Typography>
                <Typography variant="h5">
                  {currentQuestion.question}
                </Typography>
              </Box>

              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                >
                  {currentQuestion.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index.toString()}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={submitAnswer}
                disabled={selectedAnswer === ''}
                sx={{ mt: 2 }}
              >
                Submit Answer
              </Button>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Quiz Results
              </Typography>
              {Array.from(scores.entries()).map(([playerId, score]) => (
                <Typography key={playerId}>
                  {playerId}: {score} points
                </Typography>
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
                sx={{ mt: 2 }}
              >
                Return Home
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Quiz;
