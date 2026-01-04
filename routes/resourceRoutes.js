const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

// Routes
router.post('/', resourceController.createResource);           // Create resource
router.get('/', resourceController.getResources);             // Get all resources (filter by moduleId optional)
router.get('/:id', resourceController.getResourceById);       // Get a single resource
router.put('/:id', resourceController.updateResource);        // Update resource
router.delete('/:id', resourceController.deleteResource);     // Delete resource

module.exports = router;
