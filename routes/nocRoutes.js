const express = require('express');
const router = express.Router();
const { registerNoc, getNocById, downloadCertificate } = require('../controllers/nocController');

// Register NOC
router.post('/register', registerNoc);

// Get NOC data by ID
router.get('/data/:id', getNocById);

// Download certificate
router.get('/certificate/:id', downloadCertificate);

module.exports = router;