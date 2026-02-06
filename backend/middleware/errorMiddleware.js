// errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false, // usually false for errors
    message: err.message,
    statusCode,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`That route does not exist - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export { errorHandler, notFound };
