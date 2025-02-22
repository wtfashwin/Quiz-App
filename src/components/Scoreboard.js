import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
  padding: 1rem;
`;

const StyledListItem = styled(ListItem)`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  ${props => props.isTop && `
    background-color: rgba(255, 215, 0, 0.1);
  `}
`;

const Scoreboard = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom align="center">
        Scoreboard
      </Typography>
      
      <List>
        {sortedPlayers.map((player, index) => (
          <StyledListItem key={player.id} isTop={index === 0}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {index === 0 && <EmojiEventsIcon sx={{ color: '#ffd700' }} />}
              <ListItemText 
                primary={player.username}
                secondary={`Rank #${index + 1}`}
              />
            </Box>
            <Typography variant="h6">
              {player.score}
            </Typography>
          </StyledListItem>
        ))}
      </List>
    </StyledPaper>
  );
};

export default Scoreboard;
