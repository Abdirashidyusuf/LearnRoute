const express = require('express');
const router = express.Router();

const {
  createModule,
  getModules,
  getModuleById,
  updateModule,
  deleteModule
} = require('../controllers/moduleController');

const { validateObjectId } = require('../middlewares/commonMiddleware');

/**
 * POST /api/modules
 */
router.post('/', createModule);

/**
 * GET /api/modules
 */
router.get('/', getModules);

/**
 * GET /api/modules/:id
 */
router.get('/:id', validateObjectId, getModuleById);

/**
 * PUT /api/modules/:id
 */
router.put('/:id', validateObjectId, updateModule);

/**
 * DELETE /api/modules/:id
 */
router.delete('/:id', validateObjectId, deleteModule);

module.exports = router;
