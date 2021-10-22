import { Send } from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { sendMessage } from 'actions/ServerAction';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

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
    <div>
      <div>
        <div ref={messageRef}>
          <div>
            {messages.map((message, index) => (
              <span key={index}>{message}</span>
            ))}
          </div>
        </div>
      </div>
      <TextField
        id="outlined-basic"
        label="說點什麼吧..."
        variant="outlined"
        size="small"
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
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => onSendMessage()}
              >
                <Send />
              </div>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default ChatArea;
