const Resource = require('../models/resource');

// Create a new resource
exports.createResource = async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all resources (optionally filter by moduleId)
exports.getResources = async (req, res) => {
  try {
    const filter = {};
    if (req.query.moduleId) {
      filter.moduleId = req.query.moduleId;
    }
    const resources = await Resource.find(filter).sort({ displayOrder: 1 });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a resource
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
