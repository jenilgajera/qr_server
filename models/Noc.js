const mongoose = require('mongoose');

const nocSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    buildingType: { type: String, required: true, enum: ['residential', 'commercial', 'industrial', 'institutional'] },
    buildingArea: { type: Number, required: true },
    buildingHeight: { type: Number, required: true },
    purpose: { type: String, required: true },
    status: { type: String, default: 'approved', enum: ['pending', 'approved', 'rejected'] },
    certificateNumber: { type: String, unique: true },
    validUntil: { type: Date },
    certificateUrl: { type: String },
    registrationNumber: { type: String },
  },
  { timestamps: true }
);

// Generate a unique certificate number and URL
nocSchema.pre('save', function (next) {
  if (!this.certificateNumber) {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    this.certificateNumber = `FIRE-NOC-${year}-${randomNum}`;
  }

  if (!this.validUntil) {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    this.validUntil = oneYearFromNow;
  }

  // Fix the certificateUrl to use the complete server URL
  if (!this.certificateUrl) {
    this.certificateUrl = `https://fire-noc-app.vercel.app/certificate/${this._id}`;
  }

  next();
});

module.exports = mongoose.model('Noc', nocSchema);  