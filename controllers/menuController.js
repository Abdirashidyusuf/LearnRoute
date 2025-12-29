const { create, getAll, getById, updateById, deleteById } = require('../utils/crudOperations');
const { successResponse, errorResponse, paginatedResponse, notFoundResponse } = require('../utils/apiResponse');
const Menu = require('../models/menuSchema');

/**
 * Create a new menu item
 * POST /api/menus
 */
const createMenu = async (req, res) => {
  try {
    const menuData = req.body;
    
    // Validate parentId if provided
    if (menuData.parentId) {
      const parentExists = await getById(Menu, menuData.parentId);
      if (!parentExists) {
        return errorResponse(res, 'Parent menu not found', 400);
      }
    }
    
    const menu = await create(Menu, menuData);
    
    // Populate parentId if it exists
    if (menu.parentId) {
      await menu.populate('parentId');
    }
    
    return successResponse(res, menu, 'Menu created successfully', 201);
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    if (error.statusCode === 404) {
      return errorResponse(res, 'Parent menu not found', 400);
    }
    return errorResponse(res, error.message || 'Failed to create menu', 500);
  }
};

/**
 * Get all menu items with pagination
 * GET /api/menus
 */
const getMenus = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'displayOrder', search, isActive, parentId } = req.query;
    
    // Build filter
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { path: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (parentId !== undefined) {
      if (parentId === 'null' || parentId === '') {
        filter.parentId = null;
      } else {
        filter.parentId = parentId;
      }
    }
    
    const result = await getAll(Menu, {
      filter,
      sort: sort.startsWith('-') ? { [sort.slice(1)]: -1 } : { [sort]: 1 },
      page: parseInt(page),
      limit: parseInt(limit),
      populate: 'parentId',
    });
    
    return paginatedResponse(res, result.documents, result.pagination, 'Menus retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to retrieve menus', 500);
  }
};

/**
 * Get menu by ID
 * GET /api/menus/:id
 */
const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await getById(Menu, id, 'parentId');
    
    return successResponse(res, menu, 'Menu retrieved successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'Menu not found');
    }
    return errorResponse(res, error.message || 'Failed to retrieve menu', 500);
  }
};

/**
 * Get menu hierarchy (all menus with their children)
 * GET /api/menus/hierarchy
 */
const getMenuHierarchy = async (req, res) => {
  try {
    // Get all menus
    const allMenus = await Menu.find({}).sort({ displayOrder: 1 }).populate('parentId');
    
    // Build hierarchy
    const menuMap = new Map();
    const rootMenus = [];
    
    // First pass: create map of all menus
    allMenus.forEach(menu => {
      menuMap.set(menu._id.toString(), { ...menu.toObject(), children: [] });
    });
    
    // Second pass: build hierarchy
    allMenus.forEach(menu => {
      const menuObj = menuMap.get(menu._id.toString());
      if (menu.parentId) {
        const parent = menuMap.get(menu.parentId._id.toString());
        if (parent) {
          parent.children.push(menuObj);
        }
      } else {
        rootMenus.push(menuObj);
      }
    });
    
    return successResponse(res, rootMenus, 'Menu hierarchy retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to retrieve menu hierarchy', 500);
  }
};

/**
 * Update menu by ID
 * PUT /api/menus/:id
 */
const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate parentId if provided and not the same as current menu
    if (updateData.parentId) {
      if (updateData.parentId === id) {
        return errorResponse(res, 'Menu cannot be its own parent', 400);
      }
      const parentExists = await getById(Menu, updateData.parentId);
      if (!parentExists) {
        return errorResponse(res, 'Parent menu not found', 400);
      }
    }
    
    const menu = await updateById(Menu, id, updateData);
    
    // Populate parentId if it exists
    if (menu.parentId) {
      await menu.populate('parentId');
    }
    
    return successResponse(res, menu, 'Menu updated successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'Menu not found');
    }
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return errorResponse(res, 'Validation failed', 400, errors);
    }
    return errorResponse(res, error.message || 'Failed to update menu', 500);
  }
};

/**
 * Delete menu by ID
 * DELETE /api/menus/:id
 */
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if menu has children
    const children = await Menu.find({ parentId: id });
    if (children.length > 0) {
      return errorResponse(res, 'Cannot delete menu with child items. Please delete or reassign children first.', 400);
    }
    
    await deleteById(Menu, id);
    
    return successResponse(res, null, 'Menu deleted successfully');
  } catch (error) {
    if (error.statusCode === 404) {
      return notFoundResponse(res, 'Menu not found');
    }
    return errorResponse(res, error.message || 'Failed to delete menu', 500);
  }
};

module.exports = {
  createMenu,
  getMenus,
  getMenuById,
  getMenuHierarchy,
  updateMenu,
  deleteMenu,
};

