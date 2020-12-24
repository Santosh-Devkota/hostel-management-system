const jwt = require("jsonwebtoken");
const authorize = function (req, res, next) {
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   token = req.headers.authorization.split(" ")[1];
  // }
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({
      msg: "Unauthorized token used",
    });
  }
  try {
    const decodePayload = jwt.verify(token, process.env.JWT_SECRETKEY); // will give _id of user
    req.user = decodePayload;
    next();
  } catch (error) {
    res.status(401).json({
      msg: "Unauthorized token used.",
    });
  }
};
module.exports = authorize;
