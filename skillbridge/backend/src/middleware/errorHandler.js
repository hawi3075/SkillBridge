/**
 * Centralized Error Handling Middleware
 */

const { errorResponse } = require('../utils/response');

const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Cannot ${req.method} ${req.originalUrl}`, 404);
};

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Application Error:', err);

  if (err.name === 'ValidationError') {
    return errorResponse(res, err.message, 400, err.errors);
  }

  if (err.code === 'P2002') {
    // Prisma unique constraint violation
    const target = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return errorResponse(res, `A record with this ${target} already exists.`, 409);
  }

  if (err.message && err.message.includes('Only JPEG, PNG')) {
    return errorResponse(res, err.message, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, message, statusCode);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
