import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import QuizIcon from '@mui/icons-material/Quiz';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <QuizIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            QuizWiz
          </Typography>
          {isAuthenticated ? (
            <>
              <Typography sx={{ mr: 2 }}>Welcome, {user.name}!</Typography>
              {user.role === 'admin' && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/admin"
                  sx={{ mr: 2 }}
                >
                  Admin Dashboard
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ mr: 2 }}
              >
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom>
              Welcome to QuizWiz
            </Typography>
            <Typography variant="h5" color="textSecondary" paragraph>
              The ultimate real-time multiplayer quiz platform for learning and fun!
            </Typography>
            {isAuthenticated ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to={user.role === 'admin' ? '/admin' : '/join'}
                sx={{ mt: 2 }}
              >
                {user.role === 'admin' ? 'Create Quiz' : 'Join Quiz'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to="/register"
                sx={{ mt: 2 }}
              >
                Get Started
              </Button>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://img.freepik.com/free-vector/quiz-word-concept_23-2147844150.jpg"
              alt="Quiz illustration"
              sx={{
                width: '100%',
                maxWidth: 500,
                height: 'auto',
                display: 'block',
                margin: 'auto',
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h3" gutterBottom align="center">
            Features
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Real-time Multiplayer
                  </Typography>
                  <Typography>
                    Compete with friends in real-time quiz sessions. See scores update instantly!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Diverse Topics
                  </Typography>
                  <Typography>
                    Questions from various programming languages including Python, Java, and C++.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Custom Rooms
                  </Typography>
                  <Typography>
                    Create private rooms and invite friends to join your quiz session.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            About QuizWiz
          </Typography>
          <Typography variant="body1" paragraph>
            QuizWiz is a modern quiz platform designed to make learning programming concepts fun and interactive.
            Whether you're a beginner or an expert, our platform offers challenging questions across different
            programming languages and concepts.
          </Typography>
          <Typography variant="body1">
            Join our community of learners and test your knowledge in a fun, competitive environment!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
