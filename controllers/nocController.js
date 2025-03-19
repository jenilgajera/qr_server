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

    const savedNoc = await newNoc.save();
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

    const pdfBuffer = await generateCertificate(noc);
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=FireNOC_${noc._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerNoc, getNocById, downloadCertificate };