const User = require("../model/user");
const Student = require("../model/student");
const { json } = require("express");

const adminAuth = async (req, res, next) =>  {
  console.log("authAdmin called!!");
  try {
    const user = await User.findOne({ username: req.body.username });
    if(!user){
      const student = await Student.findOne({username:req.body.username});
      if(!student){
        return res.status(401).json({ msg:"Invalid username or password!" });
      }
      req.body.userrole = "student"
      
    }
    else{
      if(user.role == "admin"){
        req.body.userrole = "admin";
      }
      else{
        req.body.userrole = "administration";
      }
      
    }
  } catch (error) {
    console.log(error)
  }
  
  next();
};
module.exports = adminAuth;
