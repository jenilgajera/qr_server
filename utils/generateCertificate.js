const PDFDocument = require('pdfkit');

const generateCertificate = (nocData) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      // Buffer to store PDF data
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Add document header with QR code
      doc.image('./utils/qr_codes.jpg', { fit: [100, 100], align: 'center' });

      // Certificate Title
      doc.moveDown(1);
      doc.font('Helvetica-Bold').fontSize(24).fillColor('#FF0000').text('FIRE NOC CERTIFICATE', { align: 'center' });

      // Certificate Number
      doc.moveDown(0.5);
      doc.font('Helvetica').fontSize(14).fillColor('#000000').text(`Certificate Number: ${nocData.certificateNumber}`, { align: 'center' });

      // Add horizontal line
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
      doc.moveDown(1);

      // Certificate Details Section
      const detailsX = 70;
      const valueX = 250;

      doc.font('Helvetica-Bold').fontSize(16).text('Certificate Details', detailsX);
      doc.moveDown(1);

      // Name
      doc.font('Helvetica-Bold').fontSize(12).text('Name:', detailsX);
      doc.font('Helvetica').text(nocData.name, valueX, doc.y - 12);
      doc.moveDown(0.5);

      // Address
      doc.font('Helvetica-Bold').text('Address:', detailsX);
      doc.font('Helvetica').text(nocData.address, valueX, doc.y - 12);
      doc.moveDown(0.5);

      // Contact Details
      doc.font('Helvetica-Bold').text('Contact Number:', detailsX);
      doc.font('Helvetica').text(nocData.contactNumber, valueX, doc.y - 12);
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Email:', detailsX);
      doc.font('Helvetica').text(nocData.email, valueX, doc.y - 12);
      doc.moveDown(1);

      // Building Details Section
      doc.font('Helvetica-Bold').fontSize(16).text('Building Details', detailsX);
      doc.moveDown(1);

      doc.font('Helvetica-Bold').fontSize(12).text('Building Type:', detailsX);
      const buildingType = nocData.buildingType.charAt(0).toUpperCase() + nocData.buildingType.slice(1);
      doc.font('Helvetica').text(buildingType, valueX, doc.y - 12);
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Building Area:', detailsX);
      doc.font('Helvetica').text(`${nocData.buildingArea} sq.m`, valueX, doc.y - 12);
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Building Height:', detailsX);
      doc.font('Helvetica').text(`${nocData.buildingHeight} m`, valueX, doc.y - 12);
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Purpose:', detailsX);
      doc.font('Helvetica').text(nocData.purpose, valueX, doc.y - 12);
      doc.moveDown(1);

      // Certificate Validity Section
      doc.font('Helvetica-Bold').fontSize(16).text('Certificate Validity', detailsX);
      doc.moveDown(1);

      doc.font('Helvetica-Bold').fontSize(12).text('Issue Date:', detailsX);
      doc.font('Helvetica').text(new Date(nocData.createdAt).toLocaleDateString(), valueX, doc.y - 12);
      doc.moveDown(0.5);

      doc.font('Helvetica-Bold').text('Valid Until:', detailsX);
      doc.font('Helvetica').text(new Date(nocData.validUntil).toLocaleDateString(), valueX, doc.y - 12);
      doc.moveDown(1);

      // Add QR code and signature
      doc.moveDown(2);

      // QR code (if image is available)
      try {
        doc.image('./utils/qr_codes.jpg', {
          fit: [100, 100],
          align: 'right',
          valign: 'center'
        });
      } catch (error) {
        console.error('QR code image not found', error);
      }

      // Signature
      doc.moveDown(4);
      doc.fontSize(12).text('_______________________', { align: 'right' });
      doc.moveDown(0.5);
      doc.fontSize(12).text('Authorized Signature', { align: 'right' });

      // Add footer
      const footerY = doc.page.height - 50;
      doc.fontSize(10).text('This certificate confirms compliance with fire safety standards.', 50, footerY, { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).text(`Verify this certificate online at https://qr-server-x32l.onrender.com/api/noc/certificate/${nocData._id}`, { align: 'center' });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificate;