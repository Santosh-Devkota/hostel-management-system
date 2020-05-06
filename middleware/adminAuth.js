const adminAuth = function (req, res, next) {
  console.log("authAdmin called!!");
  //here 403 error is the forbidden error(when user is authorized but don't have rights to go to this route)
  if (!req.user.isAdmin) return res.status(403).json({ success: false });
  next();
};
module.exports = adminAuth;
