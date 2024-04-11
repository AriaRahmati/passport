const errorHandler = (err, req, res, next) => {
  const statusCode = err.status ?? err.statusCode ?? 500;
  res.send({
    statusCode,
    message: err?.message ?? 'Internal Server Error',
  });
};

module.exports = errorHandler;
