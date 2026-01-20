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
    <Container className="d-flex justify-content-center align-items-center vh-100 text-white" style={{
      background: 'radial-gradient(ellipse at center, #1a2332 0%, #0d1520 50%, #000000 100%)'
    }}>
      <div
        className="w-100 p-5 rounded-4"
        style={{
          maxWidth: '500px',
          background: 'linear-gradient(to bottom, rgba(26, 35, 50, 0.95), rgba(13, 21, 32, 0.98))',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
          borderRadius: '8px'
        }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Mango Logo"
            width={180}
            style={{
              filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))',
              marginBottom: '20px'
            }}
          />
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
            <Form.Label style={{ color: '#3b82f6', fontWeight: '500' }}>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                background: 'linear-gradient(to bottom, rgba(30, 58, 138, 0.2), rgba(13, 21, 32, 0.95))',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#ffffff',
                padding: '10px 14px',
                borderRadius: '6px'
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicPassword">
            <Form.Label style={{ color: '#3b82f6', fontWeight: '500' }}>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: 'linear-gradient(to bottom, rgba(30, 58, 138, 0.2), rgba(13, 21, 32, 0.95))',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#ffffff',
                padding: '10px 14px',
                borderRadius: '6px'
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            style={{
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              marginTop: '10px',
              background: 'linear-gradient(to bottom, #3b82f6, #2563eb, #1e40af)',
              border: '1px solid #3b82f6',
              borderRadius: '6px',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(to bottom, #60a5fa, #3b82f6, #2563eb)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(to bottom, #3b82f6, #2563eb, #1e40af)';
              e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
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
