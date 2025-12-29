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
const SkillPath = require('../models/skillPathSchema');

/**
 * Create module
 * POST /api/modules
 */
const createModule = async (req, res) => {
  try {
    const data = req.body;

    // validate skillPath
    const skillPathExists = await SkillPath.findById(data.skillPathId);
    if (!skillPathExists) {
      return errorResponse(res, 'SkillPath not found', 400);
    }

    const module = await create(Module, data);
    await module.populate('skillPathId');

    return successResponse(res, module, 'Module created successfully', 201);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get all modules (pagination + filters)
 * GET /api/modules
 */
const getModules = async (req, res) => {
  try {
    const { page = 1, limit = 10, skillPathId, isActive } = req.query;

    const filter = {};
    if (skillPathId) filter.skillPathId = skillPathId;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const result = await getAll(Module, {
      filter,
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { displayOrder: 1 },
      populate: 'skillPathId'
    });

    return paginatedResponse(
      res,
      result.documents,
      result.pagination,
      'Modules retrieved successfully'
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
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
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Update module
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
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Delete module
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
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createModule,
  getModules,
  getModuleById,
  updateModule,
  deleteModule
};
