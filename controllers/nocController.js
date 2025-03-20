const Noc = require("../models/Noc");
const generateCertificate = require("../utils/generateCertificate");

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

    // Validate required fields
    if (!name || !address || !contactNumber || !email || !buildingType || !buildingArea || !buildingHeight || !purpose) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate contact number format
    const phoneRegex = /^\d{10}$/; // Assumes 10-digit phone number
    if (!phoneRegex.test(contactNumber)) {
      return res.status(400).json({ message: "Invalid contact number" });
    }

    // Create new NOC
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

    // Generate certificate URL
    savedNoc.certificateUrl = `${process.env.FRONTEND_URL || 'https://fire-noc-app.vercel.app'}/certificate/${savedNoc._id}`;
    await savedNoc.save();

    res.status(201).json(savedNoc);
  } catch (error) {
    console.error("Register NOC error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get NOC data by ID
const getNocById = async (req, res) => {
  try {
    const noc = await Noc.findById(req.params.id);
    if (!noc) {
      return res.status(404).json({ message: "NOC not found" });
    }
    res.json(noc);
  } catch (error) {
    console.error("Get NOC error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Download certificate
const downloadCertificate = async (req, res) => {
  try {
    const noc = await Noc.findById(req.params.id);
    if (!noc) {
      return res.status(404).json({ message: "NOC not found" });
    }

    const pdfBuffer = await generateCertificate(noc);

    // Set proper headers to ensure browser handles PDF correctly
    res.contentType("application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=FireNOC_${noc._id}.pdf`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Download certificate error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerNoc, getNocById, downloadCertificate };