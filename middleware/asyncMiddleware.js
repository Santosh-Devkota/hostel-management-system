exports.asyncMiddleware = (func) => {
  return (req, res, next) => {
    try {
      func(req, res);
    } catch (error) {
      next(error);
    }
  };
};
