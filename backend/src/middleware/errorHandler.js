const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  // MySQL errors
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      error: 'A record with this information already exists'
    });
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(404).json({
      error: 'Referenced record not found'
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: error.message
    });
  }

  // Default error
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error'
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};