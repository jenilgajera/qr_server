const PDFDocument = require('pdfkit');

const generateCertificate = (noc) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });

    // Create a buffer to store the PDF
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });

    // Add content to the PDF
    doc.fontSize(25).text('Fire Department No Objection Certificate', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`Certificate Number: ${noc.certificateNumber}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Name: ${noc.name}`);
    doc.text(`Address: ${noc.address}`);
    doc.text(`Building Type: ${noc.buildingType}`);
    doc.text(`Building Area: ${noc.buildingArea} sq ft`);
    doc.text(`Building Height: ${noc.buildingHeight} meters`);
    doc.text(`Purpose: ${noc.purpose}`);
    doc.moveDown();
    doc.text(`Valid Until: ${noc.validUntil.toLocaleDateString()}`);

    // Finalize the PDF
    doc.end();
  });
};

module.exports = generateCertificate;