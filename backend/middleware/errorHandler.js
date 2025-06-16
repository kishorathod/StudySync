function errorHandler(err, req, res, next) {
  console.error('🔥 Error:', err.message);

  // Customize based on type of error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error'
  });
}

module.exports = errorHandler;
