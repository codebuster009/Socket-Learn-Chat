import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const SOCKET_SERVER_URL = 'http://localhost:4000';
const API_URL = 'http://localhost:4000/api/chat/';
const ENTERTAINER_API_URL = 'http://localhost:4000/api/chat/entertainerRoom/';

const ChatBox = () => {
  const { chatRoomID } = useParams();
  const entertainerID = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))._id;
  const userRole = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role;
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [entertainerData, setEntertainerData] = useState(null);

  const messageEndRef = useRef(null);

  const fetchMessages = async (roomID = chatRoomID) => {
    try {
      const response = await axios.get(`${API_URL}${roomID}`);
      console.log("Fetched messages:", response);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  useEffect(() => {
   
    const initializeSocket = () => {
      const newSocket = io(SOCKET_SERVER_URL);
      setSocket(newSocket);

      newSocket.on('message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      return newSocket;
    };

    let socketInstance;

    if (userRole === 'user' || userRole === 'entertainer') {
   
      socketInstance = initializeSocket();

      if (userRole === 'user') {
        fetchMessages();
        socketInstance.emit('join', chatRoomID);
      } else if (userRole === 'entertainer') {
        const fetchEntertainerData = async () => {
          try {
            const response = await axios.get(`${ENTERTAINER_API_URL}${entertainerID}`);
            if (response.data.error === null) {
              const chatRoomID = response.data.chatRoom[0]?._id;
              if (chatRoomID) {
                await fetchMessages(chatRoomID);
                socketInstance.emit('join', chatRoomID);
              }
            } else {
              console.log("Error fetching entertainer data:", response.data.error);
            }
            setEntertainerData(response.data);
            console.log('Entertainer data:', response.data);
          } catch (error) {
            console.error('Failed to fetch entertainer data:', error);
          }
        };

        fetchEntertainerData();
      }

      return () => {
        if (socketInstance) {
          socketInstance.disconnect();
        }
      };
    }
  }, [chatRoomID, userRole, entertainerID]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!socket) {
      console.error('Socket not initialized.');
      return;
    }
    console.log("Sender ID:", entertainerID , chatRoomID);
    if (message.trim()) {
      try {
        socket.emit('message', {
          chatroom_id: "92ce2475-127d-4ad2-ad34-8f1037a64eea",
          sender_id: entertainerID,
          message,
        });
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender_id === entertainerID ? 'sent' : 'received'}`}>
            <div>
              <div className='text-[15px]'>{msg.message}</div>
              <p className='text-[5px]'>{msg.sender_id}: </p>
              <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      {/* {entertainerData && (
        <div className="entertainer-info">
          <h3>Entertainer Info:</h3>
          <pre>{JSON.stringify(entertainerData, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

export default ChatBox;
