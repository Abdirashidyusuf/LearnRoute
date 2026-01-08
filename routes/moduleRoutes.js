const express = require('express');
const router = express.Router();

const {
  createModule,
  getModules,
  getModuleById,
  updateModule,
  deleteModule
} = require('../controllers/moduleController');

const { validateObjectId } = require('../middlewares/menuMiddleware'); 
// ama middleware gaar ah oo module ah haddii aad leedahay

/**
 * @route   POST /api/modules
 * @desc    Create module
 */
router.post('/', createModule);

/**
 * @route   GET /api/modules
 * @desc    Get all modules with pagination & filtering
 */
router.get('/', getModules);

/**
 * @route   GET /api/modules/:id
 * @desc    Get module by ID
 */
router.get('/:id', validateObjectId, getModuleById);

/**
 * @route   PUT /api/modules/:id
 * @desc    Update module
 */
router.put('/:id', validateObjectId, updateModule);

/**
 * @route   DELETE /api/modules/:id
 * @desc    Delete module
 */
router.delete('/:id', validateObjectId, deleteModule);

module.exports = router;
