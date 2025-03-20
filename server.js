const express = require('express');
const cors = require('cors');
const nocRoutes = require('./routes/nocRoutes');
const path = require('path');
require('dotenv').config(); // Load environment variables

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