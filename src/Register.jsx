import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    // Hardcoded values
    const status = 'active';
    const location = {
      main_address: '123 Main St',
      address_line_1: 'Apt 4B',
      address_line_2: 'Building 2',
      pin: 12345,
      lng_lat: {
        longitude: -73.935242,
        latitude: 40.730610
      },
      city: 'New York',
      state: 'NY',
      country: 'USA'
    };
  
    const navigate = useNavigate(); 
    const handleRegister = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:4000/api/addUsers', {
          name,
          email,
          password,
          status,     
          location     
        });
  
        const { users, message } = response.data;
  
        if (users && users.length > 0) {
          navigate('/home');
        } else {
          alert(message || 'Registration failed');
        }
      } catch (error) {
        alert('Registration failed: ' + error.response?.data?.message || error.message);
      }
    };
  
    return (
      <div className="register-container">
        <h1>Register</h1>
        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form>
      </div>
    );
  };
  

export default Register;
