const Connection = require('../models/Connection');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all connections for the current user
exports.getConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all connections where the user is either requester or recipient
    const connections = await Connection.find({
      $or: [
        { requester: userId },
        { recipient: userId }
      ]
    })
    .populate('requester', 'name email profileImage')
    .populate('recipient', 'name email profileImage')
    .sort({ updatedAt: -1 });

    // Organize connections by status
    const result = {
      accepted: [],
      pending: {
        sent: [],
        received: []
      }
    };

    connections.forEach(connection => {
      if (connection.status === 'accepted') {
        // Determine the other user in the connection
        const otherUser = connection.requester._id.toString() === userId 
          ? connection.recipient 
          : connection.requester;
        
        result.accepted.push({
          _id: connection._id,
          user: otherUser,
          createdAt: connection.createdAt
        });
      } else if (connection.status === 'pending') {
        if (connection.requester._id.toString() === userId) {
          // Current user sent the request
          result.pending.sent.push({
            _id: connection._id,
            user: connection.recipient,
            createdAt: connection.createdAt
          });
        } else {
          // Current user received the request
          result.pending.received.push({
            _id: connection._id,
            user: connection.requester,
            message: connection.message,
            createdAt: connection.createdAt
          });
        }
      }
    });

    res.json(result);
  } catch (err) {
    console.error('Error fetching connections:', err);
    res.status(500).json({ message: 'Failed to fetch connections', error: err.message });
  }
};

// Send a connection request
exports.sendConnectionRequest = async (req, res) => {
  try {
    if (!req.app.settings.socket) {
      return res.status(500).json({ message: 'Socket settings not initialized on server' });
    }
    const { io, onlineUsers } = req.app.settings.socket;
    
    const { userId } = req.params;
    const requesterId = req.user.id;
    const { message } = req.body;

    // Validate that userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Check if user exists
    const recipient = await User.findById(userId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get requester details
    const requester = await User.findById(requesterId, 'name profileImage');
    if (!requester) {
      return res.status(404).json({ message: 'Requester not found' });
    }

    // Prevent self-connection
    if (userId === requesterId) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: userId },
        { requester: userId, recipient: requesterId }
      ]
    });

    if (existingConnection) {
      // Return appropriate message based on existing connection status
      if (existingConnection.status === 'accepted') {
        return res.status(400).json({ message: 'Already connected with this user' });
      } else if (existingConnection.status === 'pending') {
        const isPendingSent = existingConnection.requester.toString() === requesterId;
        if (isPendingSent) {
          return res.status(400).json({ message: 'Connection request already sent' });
        } else {
          return res.status(400).json({ 
            message: 'This user has already sent you a connection request',
            connectionId: existingConnection._id
          });
        }
      } else if (existingConnection.status === 'declined') {
        // If previously declined, update to pending
        existingConnection.status = 'pending';
        existingConnection.requester = requesterId;
        existingConnection.recipient = userId;
        existingConnection.message = message || '';
        existingConnection.updatedAt = Date.now();
        await existingConnection.save();
        
        return res.status(200).json({ 
          message: 'Connection request sent',
          connection: existingConnection
        });
      }
    }

    // Create new connection request
    const newConnection = await Connection.create({
      requester: requesterId,
      recipient: userId,
      status: 'pending',
      message: message || ''
    });

    // Send real-time notification
    const recipientSocketId = onlineUsers.get(userId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('connectionRequest', {
        _id: newConnection._id,
        user: {
          _id: requesterId,
          name: requester.name,
          profileImage: requester.profileImage
        },
        message: message || '',
        createdAt: newConnection.createdAt
      });
    }

    // Populate user details
    await newConnection.populate('requester', 'name email profileImage');
    await newConnection.populate('recipient', 'name email profileImage');

    res.status(201).json({ 
      message: 'Connection request sent',
      connection: newConnection
    });
  } catch (err) {
    console.error('Error sending connection request:', err);
    res.status(500).json({ message: 'Failed to send connection request', error: err.message });
  }
};

// Accept a connection request
exports.acceptConnectionRequest = async (req, res) => {
  try {
    const { io, onlineUsers } = req.app.settings.socket;
    const { requestId } = req.params;
    const userId = req.user.id;

    // Validate that requestId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }

    // Find the connection request
    const connectionRequest = await Connection.findById(requestId);
    
    if (!connectionRequest) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Verify that the current user is the recipient of the request
    if (connectionRequest.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    // Verify that the request is pending
    if (connectionRequest.status !== 'pending') {
      return res.status(400).json({ message: `Cannot accept a ${connectionRequest.status} request` });
    }

    // Get recipient details
    const recipient = await User.findById(userId, 'name profileImage');
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Update the connection status to accepted
    connectionRequest.status = 'accepted';
    await connectionRequest.save();

    // Send real-time notification
    const requesterSocketId = onlineUsers.get(connectionRequest.requester.toString());
    if (requesterSocketId) {
      io.to(requesterSocketId).emit('connectionAccepted', {
        _id: connectionRequest._id,
        user: {
          _id: userId,
          name: recipient.name,
          profileImage: recipient.profileImage
        }
      });
    }

    // Populate user details
    await connectionRequest.populate('requester', 'name email profileImage');
    await connectionRequest.populate('recipient', 'name email profileImage');

    res.json({ 
      message: 'Connection request accepted',
      connection: connectionRequest
    });
  } catch (err) {
    console.error('Error accepting connection request:', err);
    res.status(500).json({ message: 'Failed to accept connection request', error: err.message });
  }
};

// Decline a connection request
exports.declineConnectionRequest = async (req, res) => {
  try {
    const { io, onlineUsers } = req.app.settings.socket;
    const { requestId } = req.params;
    const userId = req.user.id;

    // Validate that requestId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: 'Invalid request ID' });
    }

    // Find the connection request
    const connectionRequest = await Connection.findById(requestId);
    
    if (!connectionRequest) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Verify that the current user is the recipient of the request
    if (connectionRequest.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to decline this request' });
    }

    // Verify that the request is pending
    if (connectionRequest.status !== 'pending') {
      return res.status(400).json({ message: `Cannot decline a ${connectionRequest.status} request` });
    }

    // Update the connection status to declined
    connectionRequest.status = 'declined';
    await connectionRequest.save();

    // Optionally notify the requester
    const requesterSocketId = onlineUsers.get(connectionRequest.requester.toString());
    if (requesterSocketId) {
      io.to(requesterSocketId).emit('connectionDeclined', {
        _id: connectionRequest._id,
        userId: userId
      });
    }

    res.json({ message: 'Connection request declined' });
  } catch (err) {
    console.error('Error declining connection request:', err);
    res.status(500).json({ message: 'Failed to decline connection request', error: err.message });
  }
};

// Remove a connection
exports.removeConnection = async (req, res) => {
  try {
    const { io, onlineUsers } = req.app.settings.socket;
    const { connectionId } = req.params;
    const userId = req.user.id;

    // Validate that connectionId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(connectionId)) {
      return res.status(400).json({ message: 'Invalid connection ID' });
    }

    // Find the connection
    const connection = await Connection.findById(connectionId);
    
    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Verify that the current user is part of the connection
    if (connection.requester.toString() !== userId && connection.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to remove this connection' });
    }

    // Determine the other user in the connection
    const otherUserId = connection.requester.toString() === userId 
      ? connection.recipient.toString()
      : connection.requester.toString();

    // Delete the connection
    await Connection.findByIdAndDelete(connectionId);

    // Notify the other user if they're online
    const otherUserSocketId = onlineUsers.get(otherUserId);
    if (otherUserSocketId) {
      io.to(otherUserSocketId).emit('connectionRemoved', {
        connectionId: connectionId,
        userId: userId
      });
    }

    res.json({ message: 'Connection removed successfully' });
  } catch (err) {
    console.error('Error removing connection:', err);
    res.status(500).json({ message: 'Failed to remove connection', error: err.message });
  }
};