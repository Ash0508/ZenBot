import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import botImage from '../airobot.png';
import { FaPaperPlane } from 'react-icons/fa'; 

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #121212; /* Deep black */
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: #ffffff; /* Soft white */
  }
`;

const Container = styled.div`
  display: flex;
  width: 90%;
  max-width: 1400px;
  height: 80vh;
  background-color: #1e1e1e; /* Dark grey */
  border-radius: 10px;
  border: 2px solid #00bcd4; /* Light blue border */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5); /* Darker shadow */
  overflow: hidden;
`;

const ChatSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  background-color: #000000; /* Black */
`;

const DesignSection = styled.div`
  flex: 1;
  background: linear-gradient(to top, #2e2e4f, #00bcd4); /* Deep purple to light blue gradient */
  color: #f5f5f5; /* Soft white */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;


const BotImage = styled.img`
  width: 225px;
  height: auto;
  margin-bottom: 20px;
`;

const BotName = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(90deg, #00c6ff, #0072ff); /* Blue to teal gradient */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  // text-shadow: 2px 2px 10px rgba(0, 198, 255, 0.8), 4px 4px 15px rgba(0, 114, 255, 0.5); /* Subtle blue glow */
  transition: all 0.3s ease-in-out;

  &:hover {
  }
`;





const ChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #1e1e1e; /* Dark grey */
  border-radius: 10px;
  box-shadow: inset 0 0 10px rgba(0, 188, 212, 0.5); /* Light blue glow */
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
`;

const ChatBubble = styled.div`
  background-color: ${(props) => (props.isUser ? '#00bcd4' : '#43484d')}; /* Light blue or dark silver */
  color: ${(props) => (props.isUser ? '#000000' : '#f5f5f5')}; /* Black or soft white */
  padding: 10px;
  border-radius: 20px;
  margin: 10px 0;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  max-width: 70%;
  box-shadow: 0 2px 5px rgba(0, 188, 212, 0.5); /* Blue shadow */
  word-wrap: break-word;
`;

const FormContainer = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
`;

const InputField = styled.input`
  flex: 1;
  padding: 10px 15px;
  border-radius: 20px;
  border: 2px solid #00bcd4; /* Light blue */
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  margin-right: 10px;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 188, 212, 0.2); /* Light blue shadow */

  &:focus {
    border-color: #ff4081; /* Pink */
  }
`;

const SubmitButton = styled.button`
  background-color: #000000; /* Black */
  color: white;
  padding: 10px;
  border: none;
  border-radius: 50%;
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(255, 64, 129, 0.5); /* Pink shadow */
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #ff4081; /* Pink */
  }
`;

const ChatPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const { user, isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const chatAreaRef = useRef(null);
  const email = user ? user.email : null;

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chats?email=${email}`, {
          headers: {
            'x-api-key': process.env.REACT_APP_API_KEY,
          },
          withCredentials: true,
        });
        if (response.data && response.data.messages) {
          const chatHistory = response.data.messages.flatMap((msg) => [
            { content: msg.content, isUser: true, timestamp: new Date(msg.timestamp) },
            { content: msg.response, isUser: false, timestamp: new Date(msg.timestamp) },
          ]);
          setMessages(chatHistory.sort((a, b) => a.timestamp - b.timestamp));
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setMessages([]);
        } else {
          console.error('Error fetching chat history:', err);
        }
      }
    };

    fetchMessages();
  }, [isAuth, email, navigate]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userMessage = { content: input, isUser: true, timestamp: new Date() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const botResponse = await axios.post('http://127.0.0.1:5000/chatbot_response', {
        message: input,
      });

      const botMessageContent = botResponse.data.response;

      const botMessage = {
        content: botMessageContent,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

      await axios.post('http://localhost:5000/api/chats/save', {
        email,
        content: input,
        response: botMessageContent,
      },
      {
        headers: {
          'x-api-key': process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
      });

      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = {
        content: 'An error occurred. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <ChatSection>
          <ChatArea ref={chatAreaRef}>
            {messages.map((message, index) => (
              <ChatBubble key={index} isUser={message.isUser}>
                <p>{message.content}</p>
                <small>{new Date(message.timestamp).toLocaleString()}</small>
              </ChatBubble>
            ))}
          </ChatArea>
          <FormContainer onSubmit={handleSubmit}>
            <InputField
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <SubmitButton type="submit">
              <FaPaperPlane />
            </SubmitButton>
          </FormContainer>
        </ChatSection>
        <DesignSection>
          <BotImage src={botImage} alt="bot" />
          <BotName>ZenBot ✨</BotName>
        </DesignSection>
      </Container>
    </>
  );
};

export default ChatPage;
