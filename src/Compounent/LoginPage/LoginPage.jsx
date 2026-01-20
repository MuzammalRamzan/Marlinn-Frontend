import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/mango-logo.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // const response = await fetch('https://marlinnapp-5e0bd806334c.herokuapp.com/admin/login', {
      const response = await fetch('https://marlinnapp-f52b2d918ea3.herokuapp.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.data?.token; // Token ko data object ke andar access karein
        if (token) {
          localStorage.setItem('token', token);
          // navigate('/AdminPanil');
          navigate('/user');
        } else {
          setError('Login successful, but token not received');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 text-white">
      <div
        className="w-100 p-5 rounded-4"
        style={{
          maxWidth: '500px',
          background: 'linear-gradient(135deg, rgba(44, 24, 16, 0.95), rgba(26, 15, 8, 0.98))',
          border: '2px solid #d4af37',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Mango Logo"
            width={180}
            style={{
              filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.4))',
              marginBottom: '20px'
            }}
          />
          <h2 style={{
            color: '#d4af37',
            fontWeight: '600',
            fontSize: '28px',
            marginTop: '10px'
          }}>Welcome Back</h2>
        </div>
        {error && (
          <Alert
            variant="danger"
            style={{
              background: 'rgba(220, 53, 69, 0.15)',
              border: '1px solid #dc3545',
              color: '#ff6b6b'
            }}
          >
            {error}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label style={{ color: '#d4af37', fontWeight: '500' }}>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                background: 'linear-gradient(to bottom, rgba(139, 105, 20, 0.15), rgba(26, 15, 8, 0.9))',
                border: '2px solid #d4af37',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '8px'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label style={{ color: '#d4af37', fontWeight: '500' }}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: 'linear-gradient(to bottom, rgba(139, 105, 20, 0.15), rgba(26, 15, 8, 0.9))',
                border: '2px solid #d4af37',
                color: '#ffffff',
                padding: '12px 16px',
                borderRadius: '8px'
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 btn-pink"
            style={{
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              marginTop: '10px'
            }}
          >
            Sign In
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default LoginPage;
