// scripts/generateUpiQr.js
// Script to generate a UPI QR code and save it in the public folder

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// UPI details from environment variables
const payeeVPA = process.env.UPI_ID;
const payeeName = process.env.UPI_NAME;
const amount = process.env.UPI_AMOUNT;
const transactionNote = 'Payment for order';

if (!payeeVPA || !payeeName || !amount) {
  console.error('Missing UPI details in .env file. Please set UPI_ID, UPI_NAME, and UPI_AMOUNT.');
  process.exit(1);
}

// UPI payment URL format
const upiUrl = `upi://pay?pa=${encodeURIComponent(payeeVPA)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(amount)}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;

// Output path
const outputPath = path.join(__dirname, '../public/upi-qr.png');

// Generate QR code and save as PNG
QRCode.toFile(outputPath, upiUrl, {
  color: {
    dark: '#000',
    light: '#FFF',
  },
}, function (err) {
  if (err) throw err;
  console.log('UPI QR code saved to', outputPath);
});
