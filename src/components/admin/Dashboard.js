import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
  padding: 1.5rem;
  height: 100%;
`;

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '1rem 0' }}>
    {value === index && children}
  </div>
);

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [activeRooms, setActiveRooms] = useState([
    { id: 'room1', code: 'ABC123', players: 3, status: 'waiting' },
    { id: 'room2', code: 'XYZ789', players: 5, status: 'in-progress' },
  ]);

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'What is the capital of France?',
      category: 'General Knowledge',
      difficulty: 'Easy',
    },
    {
      id: 2,
      question: 'What is React?',
      category: 'Programming',
      difficulty: 'Medium',
    },
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateRoom = () => {
    // Implementation for creating a new room
  };

  const handleStartGame = (roomId) => {
    setActiveRooms(rooms =>
      rooms.map(room =>
        room.id === roomId
          ? { ...room, status: 'in-progress' }
          : room
      )
    );
  };

  const handleStopGame = (roomId) => {
    setActiveRooms(rooms =>
      rooms.map(room =>
        room.id === roomId
          ? { ...room, status: 'completed' }
          : room
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Active Rooms" />
                <Tab label="Question Bank" />
                <Tab label="Statistics" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateRoom}
                >
                  Create New Room
                </Button>
              </Box>

              <List>
                {activeRooms.map((room) => (
                  <ListItem
                    key={room.id}
                    sx={{
                      mb: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={`Room Code: ${room.code}`}
                      secondary={`Players: ${room.players} | Status: ${room.status}`}
                    />
                    <ListItemSecondaryAction>
                      {room.status === 'waiting' && (
                        <IconButton
                          edge="end"
                          onClick={() => handleStartGame(room.id)}
                          color="primary"
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      )}
                      {room.status === 'in-progress' && (
                        <IconButton
                          edge="end"
                          onClick={() => handleStopGame(room.id)}
                          color="error"
                        >
                          <StopIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                >
                  Add New Question
                </Button>
              </Box>

              <List>
                {questions.map((question) => (
                  <ListItem
                    key={question.id}
                    sx={{
                      mb: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={question.question}
                      secondary={`Category: ${question.category} | Difficulty: ${question.difficulty}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Game Statistics
              </Typography>
              {/* Add statistics content here */}
            </TabPanel>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
