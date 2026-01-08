const {
  create,
  getAll,
  getById,
  updateById,
  deleteById
} = require('../utils/crudOperations');

const {
  successResponse,
  errorResponse,
  paginatedResponse,
  notFoundResponse
} = require('../utils/apiResponse');

const ActivityLog = require('../models/activityLogSchema');

/**
 * Create activity log
 * POST /api/activity-logs
 */
const createActivityLog = async (req, res) => {
  try {
    const log = await create(ActivityLog, req.body);
    return successResponse(res, log, 'Activity log created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to create activity log', 500);
  }
};

/**
 * Get all activity logs with pagination & filters
 * GET /api/activity-logs
 */
const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, userId, eventType } = req.query;

    const filter = {};

    if (userId) filter.userId = userId;
    if (eventType) filter.eventType = eventType;

    const result = await getAll(ActivityLog, {
      filter,
      sort: { createdAt: -1 },
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'userId'
    });

    return paginatedResponse(
      res,
      result.documents,
      result.pagination,
      'Activity logs retrieved successfully'
    );
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to retrieve activity logs', 500);
  }
};

/**
 * Get activity log by ID
 * GET /api/activity-logs/:id
 */
const getActivityLogById = async (req, res) => {
  try {
    const log = await getById(ActivityLog, req.params.id, 'userId');
    return successResponse(res, log, 'Activity log retrieved successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'Activity log not found');
    }
    return errorResponse(res, error.message || 'Failed to retrieve activity log', 500);
  }
};

/**
 * Update activity log
 * PUT /api/activity-logs/:id
 */
const updateActivityLog = async (req, res) => {
  try {
    const log = await updateById(ActivityLog, req.params.id, req.body);
    return successResponse(res, log, 'Activity log updated successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'Activity log not found');
    }
    return errorResponse(res, error.message || 'Failed to update activity log', 500);
  }
};

/**
 * Delete activity log
 * DELETE /api/activity-logs/:id
 */
const deleteActivityLog = async (req, res) => {
  try {
    await deleteById(ActivityLog, req.params.id);
    return successResponse(res, null, 'Activity log deleted successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'Activity log not found');
    }
    return errorResponse(res, error.message || 'Failed to delete activity log', 500);
  }
};

module.exports = {
  createActivityLog,
  getActivityLogs,
  getActivityLogById,
  updateActivityLog,
  deleteActivityLog
};
