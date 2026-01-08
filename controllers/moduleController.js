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

const Module = require('../models/moduleSchema');

/**
 * Create a new module
 * POST /api/modules
 */
const createModule = async (req, res) => {
  try {
    const module = await create(Module, req.body);

    await module.populate('skillPathId');

    return successResponse(res, module, 'Module created successfully', 201);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    return errorResponse(res, error.message || 'Failed to create module', 500);
  }
};

/**
 * Get all modules with pagination & filters
 * GET /api/modules
 */
const getModules = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      skillPathId,
      search,
      sort = 'displayOrder'
    } = req.query;

    const filter = {};

    if (skillPathId) {
      filter.skillPathId = skillPathId;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const result = await getAll(Module, {
      filter,
      sort: sort.startsWith('-')
        ? { [sort.slice(1)]: -1 }
        : { [sort]: 1 },
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'skillPathId'
    });

    return paginatedResponse(
      res,
      result.documents,
      result.pagination,
      'Modules retrieved successfully'
    );
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to retrieve modules', 500);
  }
};

/**
 * Get module by ID
 * GET /api/modules/:id
 */
const getModuleById = async (req, res) => {
  try {
    const module = await getById(Module, req.params.id, 'skillPathId');
    return successResponse(res, module, 'Module retrieved successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'Module not found');
    }
    return errorResponse(res, error.message || 'Failed to retrieve module', 500);
  }
};

/**
 * Update module by ID
 * PUT /api/modules/:id
 */
const updateModule = async (req, res) => {
  try {
    const module = await updateById(Module, req.params.id, req.body);

    await module.populate('skillPathId');

    return successResponse(res, module, 'Module updated successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'Module not found');
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    return errorResponse(res, error.message || 'Failed to update module', 500);
  }
};

/**
 * Delete module by ID
 * DELETE /api/modules/:id
 */
const deleteModule = async (req, res) => {
  try {
    await deleteById(Module, req.params.id);
    return successResponse(res, null, 'Module deleted successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'Module not found');
    }
    return errorResponse(res, error.message || 'Failed to delete module', 500);
  }
};

module.exports = {
  createModule,
  getModules,
  getModuleById,
  updateModule,
  deleteModule
};
