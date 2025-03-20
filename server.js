const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nocRoutes = require('./routes/nocRoutes');
const path = require('path');
require('dotenv').config(); // Load environment variables

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Add connection error handling
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });
    
    // Handle disconnections
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Call the connectDB function
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/noc', nocRoutes);

// Redirect to frontend for certificate viewing
app.get('/certificate/:id', (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL || 'https://fire-noc-app.vercel.app'}/view-certificate/${req.params.id}`);
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));