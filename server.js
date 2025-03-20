const express = require('express');
const cors = require('cors');
const nocRoutes = require('./routes/nocRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/noc', nocRoutes);

// Add a direct route for certificate viewing that matches the QR code URL
app.get('/certificate/:id', (req, res) => {
  // Redirect to the frontend certificate view page
  res.redirect(`${process.env.FRONTEND_URL || 'https://fire-noc-app.vercel.app'}/view-certificate/${req.params.id}`);
  
  // Alternatively, you can serve an HTML page directly:
  /*
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fire NOC Certificate</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
      <div class="container mt-5 text-center">
        <h2>Fire NOC Certificate</h2>
        <p>Click the button below to download your certificate.</p>
        <a href="/api/noc/certificate/${req.params.id}" class="btn btn-danger">Download Certificate</a>
      </div>
    </body>
    </html>
  `);
  */
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));