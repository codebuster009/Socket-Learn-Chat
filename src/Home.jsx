import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [entertainers, setEntertainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEntertainers = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get('http://localhost:4000/api/user/entertainers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEntertainers(response.data.entertainers || []);
    } catch (error) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleEntertainerClick = async (entertainerId) => {
    const token = localStorage.getItem('token');
    const userId = JSON.parse(atob(token.split('.')[1]))._id; 

    try {
      const response = await axios.post('http://localhost:4000/api/user/chatRoom', {
        user_id: userId,
        entertainer_id: entertainerId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const chatRoomId = response.data.chatRoom._id;
      console.log("chatRoomId" , chatRoomId)
      navigate(`/chat/${chatRoomId}`); 
    } catch (error) {
      setError(error.message || 'Failed to create chat room');
    }
  };

  useEffect(() => {
    fetchEntertainers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Entertainers List</h1>
      <ul>
        {entertainers.map((entertainer) => (
          <li key={entertainer._id} onClick={() => handleEntertainerClick(entertainer._id)}>
            {entertainer.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
