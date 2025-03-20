const Noc = require('../models/Noc');
const generateCertificate = require('../utils/generateCertificate');

// Register a new NOC
const registerNoc = async (req, res) => {
  try {
    const {
      name,
      address,
      contactNumber,
      email,
      buildingType,
      buildingArea,
      buildingHeight,
      purpose,
    } = req.body;

    // Create a new NOC document
    const newNoc = new Noc({
      name,
      address,
      contactNumber,
      email,
      buildingType,
      buildingArea,
      buildingHeight,
      purpose,
    });

    // Save the document to the database
    const savedNoc = await newNoc.save();

    // Respond with the saved NOC data
    res.status(201).json(savedNoc);
  } catch (error) {
    console.error('Register NOC error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get NOC data by ID
const getNocById = async (req, res) => {
  try {
    const noc = await Noc.findById(req.params.id);
    if (!noc) {
      return res.status(404).json({ message: 'NOC not found' });
    }

    // Respond with the NOC data
    res.json(noc);
  } catch (error) {
    console.error('Get NOC error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Download certificate
const downloadCertificate = async (req, res) => {
  try {
    const noc = await Noc.findById(req.params.id);
    if (!noc) {
      return res.status(404).json({ message: 'NOC not found' });
    }

    // Generate the PDF certificate
    const pdfBuffer = await generateCertificate(noc);

    // Set response headers for PDF download
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=FireNOC_${noc._id}.pdf`);

    // Send the PDF buffer as the response
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerNoc, getNocById, downloadCertificate };