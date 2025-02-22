import React, { useState } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import styled from 'styled-components';

const OptionButton = styled(Button)`
  margin: 8px 0;
  width: 100%;
  text-transform: none;
  ${props => props.selected && `
    background-color: ${props.correct ? '#4caf50' : '#f44336'} !important;
    color: white !important;
  `}
  ${props => props.correct && `
    background-color: #4caf50 !important;
    color: white !important;
  `}
`;

const Question = ({ question, timeLeft, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswer = (answer) => {
    if (!selectedAnswer && !question.ended) {
      setSelectedAnswer(answer);
      onAnswer(answer);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {question.question}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={(timeLeft / 15) * 100} 
          sx={{ mb: 2 }}
        />
        <Typography align="center" variant="subtitle1">
          Time left: {timeLeft}s
        </Typography>
      </Box>

      <Box>
        {question.options.map((option, index) => (
          <OptionButton
            key={index}
            variant="outlined"
            onClick={() => handleAnswer(option)}
            selected={selectedAnswer === option}
            correct={question.ended && option === question.correct_answer}
            disabled={question.ended || selectedAnswer}
          >
            {option}
          </OptionButton>
        ))}
      </Box>

      {question.ended && (
        <Typography 
          variant="h6" 
          align="center" 
          sx={{ mt: 2 }}
          color={selectedAnswer === question.correct_answer ? 'success' : 'error'}
        >
          {selectedAnswer === question.correct_answer 
            ? 'Correct!' 
            : `Wrong! The correct answer was: ${question.correct_answer}`}
        </Typography>
      )}
    </Box>
  );
};

export default Question;
