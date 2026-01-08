const express = require('express');
const router = express.Router();

const {
  createActivityLog,
  getActivityLogs,
  getActivityLogById,
  updateActivityLog,
  deleteActivityLog
} = require('../controllers/activityLogController');

const { validateObjectId } = require('../middlewares/menuMiddleware'); 
// Haddii aad leedahay middleware gaar ah, beddel

/**
 * @route   POST /api/activity-logs
 * @desc    Create activity log
 */
router.post('/', createActivityLog);

/**
 * @route   GET /api/activity-logs
 * @desc    Get all activity logs
 */
router.get('/', getActivityLogs);

/**
 * @route   GET /api/activity-logs/:id
 * @desc    Get activity log by ID
 */
router.get('/:id', validateObjectId, getActivityLogById);

/**
 * @route   PUT /api/activity-logs/:id
 * @desc    Update activity log
 */
router.put('/:id', validateObjectId, updateActivityLog);

/**
 * @route   DELETE /api/activity-logs/:id
 * @desc    Delete activity log
 */
router.delete('/:id', validateObjectId, deleteActivityLog);

module.exports = router;
