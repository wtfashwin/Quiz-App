import React, { useState, useEffect, useRef } from 'react';
import { Paper, Typography, TextField, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
  padding: 1rem;
  height: 300px;
  display: flex;
  flex-direction: column;
`;

const ChatMessages = styled(Box)`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding: 0.5rem;
`;

const MessageBubble = styled(Box)`
  background-color: ${props => props.isUser ? '#2196f3' : '#424242'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  max-width: 80%;
  word-wrap: break-word;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const ChatInput = styled(Box)`
  display: flex;
  gap: 0.5rem;
`;

const SendButton = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const Chat = ({ socket, roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const username = localStorage.getItem('username');
      socket.emit('send_message', {
        roomId,
        message: newMessage,
        username
      });
      setNewMessage('');
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>

      <ChatMessages>
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            isUser={msg.username === localStorage.getItem('username')}
          >
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {msg.username}
            </Typography>
            <Typography>{msg.message}</Typography>
          </MessageBubble>
        ))}
        <div ref={messagesEndRef} />
      </ChatMessages>

      <form onSubmit={handleSend}>
        <ChatInput>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <SendButton onClick={handleSend}>
            <SendIcon />
          </SendButton>
        </ChatInput>
      </form>
    </StyledPaper>
  );
};

export default Chat;
