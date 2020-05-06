const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode).json({
    success: false,
    msg: err.message,
  });
};
module.exports = errorHandler;
