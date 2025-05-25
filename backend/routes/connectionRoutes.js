// routes/connectionRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getConnections, 
  sendConnectionRequest, 
  acceptConnectionRequest, 
  declineConnectionRequest,
  removeConnection
} = require('../controllers/connectionController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protect);

// Get all connections for the current user
router.get('/', getConnections);

// Send a connection request
router.post('/request/:userId', sendConnectionRequest);

// Accept a connection request
router.post('/accept/:requestId', acceptConnectionRequest);

// Decline a connection request
router.post('/decline/:requestId', declineConnectionRequest);

// Remove a connection
router.delete('/:connectionId', removeConnection);

module.exports = router;