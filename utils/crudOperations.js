/**
 * Generic CRUD operations for any Mongoose model
 * These functions can be used with any model/table
 */

/**
 * Create a new document
 * @param {Model} Model - Mongoose model
 * @param {Object} data - Data to create
 * @returns {Promise<Object>} Created document
 */
const create = async (Model, data) => {
  try {
    const document = new Model(data);
    const savedDocument = await document.save();
    return savedDocument;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all documents with optional filtering, sorting, and pagination
 * @param {Model} Model - Mongoose model
 * @param {Object} options - Query options
 * @param {Object} options.filter - Filter criteria
 * @param {Object} options.sort - Sort criteria
 * @param {Number} options.page - Page number (default: 1)
 * @param {Number} options.limit - Documents per page (default: 10)
 * @param {String} options.populate - Fields to populate
 * @returns {Promise<Object>} Object with documents and pagination info
 */
const getAll = async (Model, options = {}) => {
  try {
    const {
      filter = {},
      sort = { createdAt: -1 },
      page = 1,
      limit = 10,
      populate = null,
    } = options;

    const skip = (page - 1) * limit;

    let query = Model.find(filter).sort(sort).skip(skip).limit(limit);

    if (populate) {
      query = query.populate(populate);
    }

    const [documents, total] = await Promise.all([
      query.exec(),
      Model.countDocuments(filter),
    ]);

    return {
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get a single document by ID
 * @param {Model} Model - Mongoose model
 * @param {String} id - Document ID
 * @param {String|Array} populate - Fields to populate
 * @returns {Promise<Object>} Document
 */
const getById = async (Model, id, populate = null) => {
  try {
    let query = Model.findById(id);

    if (populate) {
      query = query.populate(populate);
    }

    const document = await query.exec();

    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    return document;
  } catch (error) {
    throw error;
  }
};


/**
 * Update a document by ID
 * @param {Model} Model - Mongoose model
 * @param {String} id - Document ID
 * @param {Object} data - Data to update
 * @param {Object} options - Update options (e.g., { new: true, runValidators: true })
 * @returns {Promise<Object>} Updated document
 */
const updateById = async (Model, id, data, options = {}) => {
  try {
    const updateOptions = {
      new: true,
      runValidators: true,
      ...options,
    };

    const document = await Model.findByIdAndUpdate(id, data, updateOptions);

    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    return document;
  } catch (error) {
    throw error;
  }
};


/**
 * Delete a document by ID
 * @param {Model} Model - Mongoose model
 * @param {String} id - Document ID
 * @returns {Promise<Object>} Deleted document
 */
const deleteById = async (Model, id) => {
  try {
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    return document;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};

