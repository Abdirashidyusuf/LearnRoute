const UserResourceStatus = require('../models/UserResourceStatus');

// Create a new User Resource Status
const createUserResourceStatus = async (req, res) => {
  try {
    const { userId, resourceId, status } = req.body;

    // Check if the status already exists for the user-resource pair
    const existingStatus = await UserResourceStatus.findOne({ userId, resourceId });
    if (existingStatus) {
      return res.status(400).json({ message: 'User already has a status for this resource.' });
    }

    const newStatus = new UserResourceStatus({
      userId,
      resourceId,
      status,
      completedAt: status === 'completed' ? new Date() : null,
    });

    await newStatus.save();
    res.status(201).json(newStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all resource statuses for a user
const getUserResourceStatuses = async (req, res) => {
  try {
    const { userId } = req.params;

    const statuses = await UserResourceStatus.find({ userId }).populate('resourceId');
    if (!statuses || statuses.length === 0) {
      return res.status(404).json({ message: 'No statuses found for this user.' });
    }

    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing User Resource Status
const updateUserResourceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { statusId } = req.params;

    // Validate the status
    if (!['not_started', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updatedStatus = await UserResourceStatus.findByIdAndUpdate(
      statusId,
      {
        status,
        lastUpdated: new Date(),
        completedAt: status === 'completed' ? new Date() : null,
      },
      { new: true }
    );

    if (!updatedStatus) {
      return res.status(404).json({ message: 'User resource status not found.' });
    }

    res.status(200).json(updatedStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a User Resource Status
const deleteUserResourceStatus = async (req, res) => {
  try {
    const { statusId } = req.params;

    const status = await UserResourceStatus.findByIdAndDelete(statusId);
    if (!status) {
      return res.status(404).json({ message: 'Status not found.' });
    }

    res.status(200).json({ message: 'User resource status deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createUserResourceStatus,
  getUserResourceStatuses,
  updateUserResourceStatus,
  deleteUserResourceStatus,
};
