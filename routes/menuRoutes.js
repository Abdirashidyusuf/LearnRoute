const express = require('express');
const router = express.Router();
const {
  createMenu,
  getMenus,
  getMenuById,
  getMenuHierarchy,
  updateMenu,
  deleteMenu,
} = require('../controllers/menuController');
const {
  validateCreateMenu,
  validateUpdateMenu,
  validateObjectId,
} = require('../middlewares/menuMiddleware');

/**
 * @route   POST /api/menus
 * @desc    Create a new menu item
 * @access  Public (can be changed to private later)
 */
router.post('/', validateCreateMenu, createMenu);

/**
 * @route   GET /api/menus
 * @desc    Get all menu items with pagination and filtering
 * @access  Public (can be changed to private later)
 */
router.get('/', getMenus);

/**
 * @route   GET /api/menus/hierarchy
 * @desc    Get menu items in hierarchical structure
 * @access  Public (can be changed to private later)
 */
router.get('/hierarchy', getMenuHierarchy);

/**
 * @route   GET /api/menus/:id
 * @desc    Get menu item by ID
 * @access  Public (can be changed to private later)
 */
router.get('/:id', validateObjectId, getMenuById);

/**
 * @route   PUT /api/menus/:id
 * @desc    Update menu item by ID
 * @access  Public (can be changed to private later)
 */
router.put('/:id', validateObjectId, validateUpdateMenu, updateMenu);

/**
 * @route   DELETE /api/menus/:id
 * @desc    Delete menu item by ID
 * @access  Public (can be changed to private later)
 */
router.delete('/:id', validateObjectId, deleteMenu);

module.exports = router;

