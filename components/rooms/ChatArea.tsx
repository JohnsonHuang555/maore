import { Send } from '@mui/icons-material';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { sendMessage } from '@actions/ServerAction';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import IconButton from '@mui/material/IconButton';

type ChatAreaProps = {
  messages: string[];
};

const ChatArea = (props: ChatAreaProps) => {
  const { messages } = props;
  const messageRef = useRef<any>(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const dispatch = useDispatch();

  // use effects start
  useEffect(() => {
    if (messageRef && messageRef.current) {
      messageRef.current.addEventListener('DOMNodeInserted', () => {
        const scroll =
          messageRef.current.scrollHeight - messageRef.current.clientHeight;
        messageRef.current.scrollTo(0, scroll);
      });
    }
  }, []);

  const onSendMessage = () => {
    if (!currentMessage) {
      return;
    }
    dispatch(sendMessage(currentMessage));
    setCurrentMessage('');
  };

  return (
    <Box
      sx={{
        flex: '0.4',
        marginBottom: '15px',
        backgroundColor: 'primary.dark',
        padding: '10px',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          borderRadius: '5px',
          flex: '1',
          padding: '10px',
          display: 'flex',
          minHeight: '0',
          marginBottom: '5px',
        }}
      >
        <Box sx={{ flex: '1', overflow: 'auto' }} ref={messageRef}>
          <Box
            sx={{ height: '120px', display: 'flex', flexDirection: 'column' }}
          >
            {messages.map((message, index) => (
              <span key={index}>{message}</span>
            ))}
          </Box>
        </Box>
      </Box>
      <TextField
        id="outlined-basic"
        label="說點什麼吧..."
        variant="outlined"
        size="small"
        fullWidth
        value={currentMessage}
        InputProps={{
          onKeyDown: (e) => {
            if (e.key === 'Enter') {
              onSendMessage();
            }
          },
          onChange: (e) => {
            setCurrentMessage(e.target.value);
          },
          endAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={onSendMessage} edge="end">
                <Send fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default ChatArea;
