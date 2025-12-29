# Utils Folder - CRUD Operations

This folder contains reusable utility functions for CRUD operations that can be used with any Mongoose model/table.

## Files

- **`crudOperations.js`** - Generic CRUD functions for any model
- **`apiResponse.js`** - Standard API response helpers
- **`customErrors.js`** - Custom error classes
- **`index.js`** - Central export for all utilities

## Usage Examples

### Using CRUD Operations in a Controller

```javascript
const { create, getAll, getById, updateById, deleteById } = require('../utils/crudOperations');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const User = require('../models/User');

// Create
const createUser = async (req, res) => {
  try {
    const user = await create(User, req.body);
    return successResponse(res, user, 'User created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// Get All with Pagination
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const result = await getAll(User, {
      filter: {},
      sort,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    return paginatedResponse(res, result.documents, result.pagination);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// Get By ID
const getUserById = async (req, res) => {
  try {
    const user = await getById(User, req.params.id);
    return successResponse(res, user);
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

// Update
const updateUser = async (req, res) => {
  try {
    const user = await updateById(User, req.params.id, req.body);
    return successResponse(res, user, 'User updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};

// Delete
const deleteUser = async (req, res) => {
  try {
    await deleteById(User, req.params.id);
    return successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, error.statusCode || 500);
  }
};
```

## Available CRUD Functions

### Create
- `create(Model, data)` - Create a new document

### Read
- `getAll(Model, options)` - Get all documents with pagination
- `getById(Model, id, populate)` - Get document by ID
- `getOne(Model, filter, populate)` - Get one document by filter
- `count(Model, filter)` - Count documents
- `exists(Model, filter)` - Check if document exists

### Update
- `updateById(Model, id, data, options)` - Update by ID
- `updateOne(Model, filter, data, options)` - Update by filter

### Delete
- `deleteById(Model, id)` - Delete by ID
- `deleteOne(Model, filter)` - Delete by filter
- `deleteMany(Model, filter)` - Delete multiple documents

## API Response Helpers

- `successResponse(res, data, message, statusCode)`
- `errorResponse(res, message, statusCode, errors)`
- `validationErrorResponse(res, errors, message)`
- `notFoundResponse(res, message)`
- `unauthorizedResponse(res, message)`
- `forbiddenResponse(res, message)`
- `paginatedResponse(res, documents, pagination, message)`

## Custom Errors

- `NotFoundError` - 404 errors
- `ValidationError` - 400 validation errors
- `UnauthorizedError` - 401 errors
- `ForbiddenError` - 403 errors
- `ConflictError` - 409 errors
- `BadRequestError` - 400 errors

