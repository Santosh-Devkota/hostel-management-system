const bcrypt = require("bcrypt");
const Staffs = require("../model/staff");
const Student = require("../model/student");
var generator = require('generate-password');
const student = require("../model/student");
var fs = require("fs");
var path = require("path");
var appDir = path.dirname(require.main.filename);

//@des regsiter staff
//@router Post /auth/register/staff
//@access private
exports.registerStaff = async (req, res, next) => {
  try {
    const staff = await Staffs.findOne({ username:req.body.username });
    if(staff){
      return res.status(400).json({msg:"Staff already exists"});
    }

    const newStaff = new Staffs({
      username: req.body.username,
      email: req.body.email,
      isPasswordChanged:false
    });
    if(!req.body.role)
    {
      newStaff.role = "student";
    } else
    {
      newStaff.role = req.body.role;
    }
        password = generator.generate({
          length: process.env.PASSWORD_SIZE,
          numbers: true
      });
    newStaff.password = password;
    await newStaff.save();
    return res.status(200).json({
      msg:"User created successfully!"
    })
  } catch (error) {
    console.log(error.message);
    res.staus(400).json({msg:"Unable to create the user"});
  }
};

//@route GET /auth/find/staff/:username
exports.findStaffByUsername = async(req,res)=>{
 try {
  const staff = await Staffs.findOne({username:req.params.username});
  if(!staff){
    return res.status(404).json({msg:"No staffs found!"});
  }
  res.status(200).json({data:staff});
  
 } catch (error) {
   console.log(error.message);
   res.status(400).json({msg:"Unable to find staff"});
 }
}
//@route GET /auth/findall/staff
//role = hostelstaff/meshstaff 
exports.findAllStaffs = async(req,res)=>{
  try {
    var staff
    if(req.query.role){
      staff = await Staffs.find({role:req.query.role});
    }else{
      staff = await Staffs.find();
    }
    
   if(staff.length === 0 ){
     return res.status(404).json({msg:"No staffs found!"});
   }
   res.status(200).json({data:staff});
   
  } catch (error) {
    console.log(error.message);
    res.status(400).json({msg:"Unable to find staff"});
  }
 }

//@route PUT /auth/update/staff/:id
exports.updateStaffDetails = async(req,res)=>{
  try {
    // req.body.imageUrl = req.upload;
    const result = await Staffs.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!result){
      return res.status(404).json({msg:"Staff with given id not found!"});
    }
    res.status(200).json({msg:"Updated Successfully!",data:result});
  } catch (error) {
    console.log(error.message);
    fs.unlinkSync(appDir + req.upload);
    res.status(400).json({msg:"Couldn't update/upload!"});
  }
}



//@route Delete /auth/delete/staff/:id
exports.deleteStaff = async(req,res)=>{
  try {
    const result1 = await Staffs.findByIdAndDelete(req.params.id);
    if(!result1){
      return res.status(404).json({msg:"Staff with given id not found!"});
    }
    res.status(200).json({msg:"Staff delete successful!"});
  } catch (error) {
    console.log(error.message);
    res.status(400).json({msg:"Unable to delete the message!"});
  }
}

//@des      login the user
//@route    POST /auth/login
//@access   Public
exports.loginUser = async (req, res, next) => {
  var role;
  try {
    
    const staff = await Staffs.findOne({username:req.body.username});
    if(!staff){
      const student = await Student.findOne({rollNo:req.body.username});
      if(!student){
        res.status(400).json({msg:"Invalid username or password!"});
      }
      role = student.role;
    } else {
      role = staff.role;
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({msg:"Invalid username or pw"});
  }

  ////////////////////////////////////
  if(role == "admin" || role == "hostelstaff" || role == "messstaff"){
    const staff = await Staffs.findOne({username:req.body.username}).select("+password");
    if(!staff.isPasswordChanged){
      if(req.body.password == staff.password){
        // means password matches to the unchanged password
        const token = staff.generateAuthToken();
        return res.status(200).json({data:{token:token}});
      }
      res.status(400).json({
        msg:"Invalid username or password"
      })
    } else if (staff.isPasswordChanged){
      const validPassword = await bcrypt.compare(
        req.body.password,
        staff.password
      );
      if(!validPassword){
        return res.status(400).json({
          msg:"Invalid username or password"
        })
      }
      staff.password = undefined;
      const token = staff.generateAuthToken();
      res.status(200).json({data:{user:staff,token:token}});
    }

  }
  else if(role == "student"){
    try {
        const student = await Student.findOne({rollNo: req.body.username}).select("+password");
          if(!student.isPasswordChanged){
            if(req.body.password == student.password){
              // means password matches to the unchanged password
              const token = student.generateAuthToken();
              return res.status(200).json({user:user,data:{token:token}});
            }
            res.status(400).json({
              msg:"Invalid username or password"
            })
          }
          else if(student.isPasswordChanged){
            const user = await Student.findOne({rollNo:req.body.username}).select("+password");
            const validPassword = await bcrypt.compare(
              req.body.password,
              user.password
            );
            if(!validPassword){
              return res.status(400).json({
                msg:"Invalid username or password"
              })
            }
            user.password = undefined;
            const token = user.generateAuthToken();
            res.status(200).json({user:user,data:{token:token}});
          }
    } catch (error) {
      console.log(error.message);
      res.status(400).json({msg:"Unable to login!"})
    }
  }
};

//route GET /auth/logindetails?query....
//role = hostelstaff/meshstaff/student
exports.getLoginDetails = async(req,res)=>{
  try {
    var users;
    if(req.query.role === "student"){
      users = await Student.find({password:{$gte:process.env.PASSWORD_SIZE}}).select("+password");
    }else{
      users = await Staffs.find({password:{$gte:process.env.PASSWORD_SIZE}}).select("+password");
    }
    if(!users){
      return res.status(404).json({msg:"No users found!"});
    }
    res.status(200).json({data:users});
  } catch (error) {
    console.log(error.message);
    res.status(400).json({msg:"Unable to search the users!"})
  }
}


//@route /auth/initstdpasswordreset
//@des To reset the password for first time by the student/staffs
exports.initialPasswordReset = async(req,res)=>{
        try {
          const salt = await bcrypt.genSalt(10);
          password = await bcrypt.hash(req.body.newpassword,salt);
          if(req.user._id === student){
            const student = await Student.findById(req.user._id);
            student.isPasswordChanged = true;
            student.password = password;
            await student.save();
          } else{
            const staff = await Staffs.findById(req.user._id);
            staff.isPasswordChanged = true;
            staff.password = password;
            await staff.save();
          }
          
          res.status(200).json({msg:"Password reset successful!"})
        } catch (error) {
          console.log(error.message);
          res.status(404).json({msg:"Unable to reset the password"})
        }
}

//@route /auth/resetpassword/:id
//des To reset the password of any staff/students
//Des only admins can reset the password
exports.resetPassword = async(req,res)=>{
  try {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(req.body.newpassword,salt);
    const student = await Student.findById(req.params.resetId);
    if(!student){
      const staff = await Staffs.findById(req.params.resetId);
      if(!staff){
        return res.status(404).json({msg:"Unable find the user with given resetId to reset password!"})
      }
      staff.password = password;
      await staff.save();
      res.status(200).json({msg:"Password reset successful!"})
    }
    student.password = password;
    await student.save();
    res.status(200).json({msg:"Password reset successful!"})
  } catch (error) {
    console.log(error.message);
    res.status(400).json({msg:"Unable to reset the password"})
  }
}


//@des      Get current user
//@route    GET /auth/me
//@access   Private
// exports.currentUser = async (req, res, next) => {
//   const user = await Staffs.findById(req.user._id);
//   res.status(200).json({
//     msg: user,
//   });
// };

