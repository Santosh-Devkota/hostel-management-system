const bcrypt = require("bcrypt");
const Staffs = require("../model/staff");
const Student = require("../model/student");
const ErrorResponse = require("../utils/customError");
const sendEmail = require("../utils/sendEmail");
// var generator = require('generate-password');
//const jwt = require("jsonwebtoken");
const crypto = require("crypto");
var generator = require('generate-password');
const staff = require("../model/staff");
const student = require("../model/student");

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
  if(role == "admin" || role == "hostelstaff" || role == "meshstaff"){
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
      const token = staff.generateAuthToken();
      res.status(200).json({data:{token:token}});
    }

  }
  else if(role == "student"){
    try {
        const student = await Student.findOne({rollNo: req.body.username}).select("+password");
          if(!student.isPasswordChanged){
            if(req.body.password == student.password){
              // means password matches to the unchanged password
              const token = student.generateAuthToken();
              return res.status(200).json({data:{token:token}});
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
            const token = user.generateAuthToken();
            res.status(200).json({data:{token:token}});
          }
    } catch (error) {
      console.log(error.message);
      res.status(400).json({msg:"Unable to login!"})
    }
  }
};

//route GET /auth/logindetails?query....
//role = admin/meshstaff/student
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


//@des change student password by student
//@route /auth/resetpassword/:resetId

// exports.resetPassword = async(req,res)=>{
//   try {
//     if(req.body.role == "admin" || req.body.role == "hostelstaff" || req.body.role == "meshstaff"){
//       // generating and saving the password in database
//       const salt = await bcrypt.genSalt(10);
//       password = await bcrypt.hash(req.body.newpassword, salt);            
//       const user = await Staffs.findOneAndUpdate({username:req.body.username},password,{new:true});
//       if(!user){
//         return res.status(400).json({msg:"Unable to change the password!"});
//       }
//       res.status(200).json({msg:"Password changed successfully!"});
//     } else if(req.body.role == "student"){
      
//       const salt = await bcrypt.genSalt(10);
//       pw = await bcrypt.hash(req.body.newpassword,salt);
//       const user = await Student.findOneAndUpdate({rollNo:req.body.username},{password:pw,isPasswordChanged:true},{new:true});
//       if(!user){
//         return res.status(400).json({msg:"Unable to change the password!"});
//       }
//       res.status(200).json({msg:"Password changed successfully!"});
//     }
//   } catch (error) {
//     res.status(400).json({msg:"Unable to change the password!"});
//   }
// }

//@route /auth/initstdpasswordreset
//@des To reset the password for first time by the student
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
exports.currentUser = async (req, res, next) => {
  const user = await Staffs.findById(req.user._id);
  res.status(200).json({
    msg: user,
  });
};


async function sendConfirmationEmail(req, res, user) {
  const emailConfirmToken = user.getEmailConfirmationToken();

  //saving emailConfirmToken and emailConfirmExpiry in database
  await user.save({ validateBeforeSave: false });
  //setting resetURL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/auth/confirmemail/${emailConfirmToken}`;
  const Options = {
    receiverEmail: req.body.email,
    subject: "Email Confirmation Token",
    message: `Follow this link to confirm your email: \n ${resetURL}`,
  };
  try {
    await sendEmail(Options);
  } catch (error) {
    return next(new ErrorResponse("Couldn't send the email to verify", 500));
  }
}

async function sendTokenInCookieResponse(user, statusCode, res) {
  //generating JWT
  const token = user.generateAuthToken();

  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOption.secure = true;
  }

  //sending token under the name "token"
  res.status(statusCode).cookie("token", token, cookieOption).json({
    token: token,
  });
}


//@des      Post forgot password
//@route    POST /auth/forgotpassword
//@access   Public
exports.forgotPassword = async (req, res, next) => {
  const user = await Staffs.findOne({ email: req.body.email });
  if (!user) {
    return next("Email not found", 404);
  }
  const resetToken = user.getResetPasswordToken();
  //console.log(resetToken);
  await user.save({ validateBeforeSave: false }); //here no need to run validatioon before saving
  console.log(req.protocol);
  console.log(req.get("host"));
  //#req.protocol: http
  //#req.get("host"):localhost:5000
  //setting resetURL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/auth/resetpassword/${resetToken}`;
  const Options = {
    receiverEmail: req.body.email,
    subject: "A message on Password change.",
    message: `Password reset was requested by you. So please send a PUT request to the link ${resetURL}`,
  };
  try {
    await sendEmail(Options);
    res.status(200).json({
      msg: "Email send successfully",
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email couldn't be sent", 500));
  }
};

//@des      Post forgot password
//@route    PUT /auth/resetpassword/:resettoken
//@access   Public
// exports.resetPassword = async (req, res, next) => {
//   //hashing the received token from url
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.resettoken)
//     .digest("hex");
//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });

//   //checking token and token expiry
//   if (!user) {
//     return next(new ErrorResponse("Invalid token", 400));
//   }

//   // setting new password
//   user.password = req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;
//   await user.save();

//   //sending token with the response
//   sendTokenInCookieResponse(user, 200, res);
// };

//@des      link to accept get request after clicking confirmEmail link
//@route    POST /auth/confirmemail/:emailConfirmToken
//@access   Public
exports.confirmEmail = async (req, res, next) => {
  console.log(req.params.emailconfirmtoken);
  const emailConfirmToken = crypto
    .createHash("sha256")
    .update(req.params.emailconfirmtoken)
    .digest("hex");
  console.log(emailConfirmToken);
  const user = await User.findOne({
    emailConfirmToken,
    emailConfirmExpire: { $gt: Date.now() },
  });
  console.log(user);
  if (!user) {
    return next(new ErrorResponse("Email not confirmed", 400));
  }
  console.log(user);

  user.emailConfirmExpire = undefined;
  user.emailConfirmToken = undefined;
  user.isVerified = true;
  await user.save();

  return res.status(200).json({
    msg: "Email successfully verified",
  });
};
