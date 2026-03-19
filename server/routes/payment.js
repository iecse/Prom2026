const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// @route   POST /api/payment/submit-utr
// @desc    Submit UTR for payment verification
// @access  Private
router.post('/submit-utr', authMiddleware, async (req, res) => {
  try {
    const { transactionId, paymentAmount } = req.body;

    if (!transactionId || !paymentAmount) {
      return res.status(400).json({ message: 'Please provide transaction ID and payment amount' });
    }

    const user = req.user;

    // Update payment information
    user.transactionId = transactionId;
    user.paymentAmount = paymentAmount;
    user.paymentStatus = 'completed';
    user.paymentDate = new Date();

    await user.save();

    res.status(200).json({
      message: 'UTR submitted successfully',
      paymentInfo: {
        transactionId: user.transactionId,
        paymentAmount: user.paymentAmount,
        paymentStatus: user.paymentStatus,
        paymentDate: user.paymentDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment error', error: error.message });
  }
});

// @route   GET /api/payment/status
// @desc    Get payment status
// @access  Private
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      paymentStatus: user.paymentStatus,
      transactionId: user.transactionId,
      paymentAmount: user.paymentAmount,
      paymentDate: user.paymentDate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment status error', error: error.message });
  }
});

module.exports = router;
