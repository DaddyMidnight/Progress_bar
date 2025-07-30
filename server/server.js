const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Virtual Object Placer API is running' });
});

// Authentication routes
app.post('/api/auth/login', (req, res) => {
  // TODO: Implement actual authentication
  const { email, password } = req.body;
  
  // Mock authentication
  if (email && password) {
    res.json({
      success: true,
      user: {
        id: '1',
        email,
        name: email.split('@')[0],
        plan: 'free'
      },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  // TODO: Implement actual registration
  const { name, email, password } = req.body;
  
  if (name && email && password) {
    res.json({
      success: true,
      user: {
        id: '1',
        name,
        email,
        plan: 'free'
      },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(400).json({ success: false, message: 'Missing required fields' });
  }
});

// Project routes
app.get('/api/projects', (req, res) => {
  // TODO: Implement actual project fetching
  res.json({
    success: true,
    projects: [
      {
        id: '1',
        name: 'Living Room Redesign',
        createdAt: '2024-01-15',
        objects: 3
      }
    ]
  });
});

// Image processing routes
app.post('/api/process-image', (req, res) => {
  // TODO: Implement actual image processing
  res.json({
    success: true,
    message: 'Image processed successfully',
    processedImage: 'data:image/png;base64,mock-processed-image'
  });
});

app.post('/api/place-object', (req, res) => {
  // TODO: Implement actual object placement
  const { roomImage, objectImage, position } = req.body;
  
  res.json({
    success: true,
    message: 'Object placed successfully',
    resultImage: 'data:image/png;base64,mock-result-image'
  });
});

// Subscription routes
app.get('/api/subscription', (req, res) => {
  // TODO: Implement actual subscription fetching
  res.json({
    success: true,
    subscription: {
      plan: 'free',
      status: 'active',
      startDate: new Date().toISOString()
    }
  });
});

app.post('/api/subscription/upgrade', (req, res) => {
  // TODO: Implement actual subscription upgrade
  const { planId } = req.body;
  
  res.json({
    success: true,
    message: 'Subscription upgraded successfully',
    subscription: {
      plan: planId,
      status: 'active',
      startDate: new Date().toISOString()
    }
  });
});

// Usage tracking
app.get('/api/usage', (req, res) => {
  // TODO: Implement actual usage tracking
  res.json({
    success: true,
    usage: {
      projects: 1,
      images: 5
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Virtual Object Placer API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;