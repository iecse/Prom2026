const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const AVAILABLE_EVENTS = ['Enigma', 'Order of Chaos', 'Tech Quiz'];

// @route   POST /api/events/register
// @desc    Register user for an event
// @access  Private
router.post('/register', authMiddleware, async (req, res) => {
  try {
    const { eventName } = req.body;

    // Validation
    if (!eventName) {
      return res.status(400).json({ message: 'Event name is required' });
    }

    if (!AVAILABLE_EVENTS.includes(eventName)) {
      return res.status(400).json({
        message: `Invalid event. Available events: ${AVAILABLE_EVENTS.join(', ')}`,
      });
    }

    // Check payment status
    if (req.user.paymentStatus !== 'completed') {
      return res.status(400).json({
        message: 'Payment must be completed before registering for events',
      });
    }

    // Register for event
    req.user.registerForEvent(eventName);
    await req.user.save();

    res.status(200).json({
      message: `Successfully registered for ${eventName}`,
      registeredEvents: req.user.registeredEvents,
    });
  } catch (error) {
    if (error.message.includes('Already registered')) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Event registration error', error: error.message });
    }
  }
});

// @route   GET /api/events/registered
// @desc    Get all events user is registered for
// @access  Private
router.get('/registered', authMiddleware, async (req, res) => {
  try {
    const registeredEvents = req.user.registeredEvents;

    res.status(200).json({
      registeredEvents,
      totalEvents: registeredEvents.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// @route   GET /api/events/available
// @desc    Get all available events
// @access  Public
router.get('/available', async (req, res) => {
  try {
    res.status(200).json({
      availableEvents: AVAILABLE_EVENTS,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// @route   DELETE /api/events/unregister/:eventName
// @desc    Unregister from an event
// @access  Private
router.delete('/unregister/:eventName', authMiddleware, async (req, res) => {
  try {
    const { eventName } = req.params;

    const initialLength = req.user.registeredEvents.length;

    req.user.registeredEvents = req.user.registeredEvents.filter(
      (event) => event.eventName !== eventName
    );

    if (req.user.registeredEvents.length === initialLength) {
      return res.status(404).json({ message: `Not registered for ${eventName}` });
    }

    await req.user.save();

    res.status(200).json({
      message: `Successfully unregistered from ${eventName}`,
      registeredEvents: req.user.registeredEvents,
    });
  } catch (error) {
    res.status(500).json({ message: 'Unregister error', error: error.message });
  }
});

module.exports = router;
