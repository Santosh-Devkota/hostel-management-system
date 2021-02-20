// const Staff = require("../model/staff");

const isAdmin = async (req, res, next) =>  {
  if(req.user.role != "admin"){
    return res.status(403).json({});
  }
  next();
};
module.exports = isAdmin;
