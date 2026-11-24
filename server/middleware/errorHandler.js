export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.statusCode || error.status || 500;
  const message = status === 500 ? 'Something went wrong. Please try again.' : error.message;
  res.status(status).json({ message });
}
