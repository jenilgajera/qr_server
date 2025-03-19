const express = require('express');
const cors = require('cors'); // Import the cors package
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const nocRoutes = require('./routes/nocRoutes');

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST'], // Allow only specific HTTP methods
  credentials: true, // Allow cookies and credentials
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/noc', nocRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));