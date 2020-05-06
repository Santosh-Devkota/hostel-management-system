const jwt = require("jsonwebtoken");
const authorize = function (req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "Not authorized to access this route",
    });
  }
  try {
    const decodePayload = jwt.verify(token, process.env.JWT_SECRETKEY); // will give _id of use
    req.user = decodePayload;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: "Invalid token",
    });
  }
};
module.exports = authorize;
