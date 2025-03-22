// notFound.js - A middleware for handling 404 errors
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  // errorHandler.js - A middleware for handling all errors
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
  };
  
  // Usage in your main app.js or server.js file
  // Place these at the end of all your route definitions
  // app.use('/api/trips', tripRoutes);
  // app.use('/api/expenses', expenseRoutes);
  // app.use('/api/reports', reportRoutes);
  
  // Add these after all your routes
  // app.use(notFound);
  // app.use(errorHandler);
  
  module.exports = { notFound, errorHandler };