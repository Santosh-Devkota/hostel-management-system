const bcrypt = require("bcrypt");
const User = require("../model/user");
const Student = require("../model/student");
const ErrorResponse = require("../utils/customError");
const sendEmail = require("../utils/sendEmail");
var generator = require('generate-password');
//const jwt = require("jsonwebtoken");
const crypto = require("crypto");
var generator = require('generate-password');

//@des regsiter administration
//@router Post /auth/register/administration
//@access private
exports.registerAdministration = async (req, res, next) => {
  try {
    const user = await User.findOne({ username:req.body.username });
    if(user){
      return res.status(400).json({msg:"User already exists"});
    }
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      
    });
    newUser.role = "Administration";
      const salt = await bcrypt.genSalt(10);
     newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();
    return res.status(200).json({
      msg:"User created successfully!"
    })
  } catch (error) {
    console.log(error.message);
    res.staus(400).json({msg:"Unable to create the user"});
  }
};


//@des      Register new student
//@route    POST /auth/register/student
//@access   private
exports.registerStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ username: req.body.username });
    if(student){
      return res.status(400).json({msg:"User already exists"});
    }
    const newStudent = new Student({
      username: req.body.username,
      email: req.body.email,
    });
    var password = generator.generate({
      length: 10,
      numbers: true
  });
  newStudent.isPasswordChanged = false;
  newStudent.password = password;
  newStudent.fullName = req.body.fullName;
  newStudent.faculty = req.body.faculty;
  newStudent.dob = req.body.dob;
  newStudent.address = req.body.address;
  newStudent.contact = req.body.contact;
  newStudent.batch = req.body.batch;
  console.log(newStudent);
    await newStudent.save();
    return res.status(200).json({
      msg: "Student created successfully!"
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({msg:"Unable to create the student"});
  }
};

 

//@des      login the user
//@route    POST /auth/login
//@access   Public
exports.loginUser = async (req, res, next) => {
  if(req.body.userrole == "admin" || req.body.userrole == "administration"){
    const user = await User.findOne({username:req.body.username}).select("+password");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if(!validPassword){
      return res.status(400).json({
        msg:"Invalid username or password"
      })
    }
    //to provide userrole  as a payload to the token, assiging this value
    user.role = req.body.userrole;
    const token = user.generateAuthToken();
    res.status(200).json({token:token});
    
  }
  else if(req.body.userrole == "student"){
    const student = await Student.findOne({username: req.body.username}).select("+password");
    if(!student.isPasswordChanged){
      if(req.body.password == student.password){
        // means password matches to the unchanged password
        const token = student.generateAuthToken();
        res.status(200).json({token:token});
      }
      else {
        return res.status(400).json({
          msg:"Invalid username or password"
        })
      }
    }
    else{
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
      console.log(token);
      res.status(200).json({token:token});
    }
  }



};

async function sendConfirmationEmail(req, res, user) {
  const emailConfirmToken = user.getEmailConfirmationToken();

  //saving emailConfirmToken and emailConfirmExpiry in database
  await user.save({ validateBeforeSave: false });
  //setting resetURL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/confirmemail/${emailConfirmToken}`;
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
    success: true,
    token: token,
  });
}

//@des      Get current user
//@route    GET /api/v1/auth/me
//@access   Private
exports.currentUser = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    msg: user,
  });
};

//@des      Post forgot password
//@route    POST /api/v1/auth/forgotpassword
//@access   Public
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
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
  )}/api/v1/auth/resetpassword/${resetToken}`;
  const Options = {
    receiverEmail: req.body.email,
    subject: "A message on Password change.",
    message: `Password reset was requested by you. So please send a PUT request to the link ${resetURL}`,
  };
  try {
    await sendEmail(Options);
    res.status(200).json({
      success: true,
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
//@route    PUT /api/v1/auth/resetpassword/:resettoken
//@access   Public
exports.resetPassword = async (req, res, next) => {
  //hashing the received token from url
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  //checking token and token expiry
  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // setting new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  //sending token with the response
  sendTokenInCookieResponse(user, 200, res);
};

//@des      link to accept get request after clicking confirmEmail link
//@route    POST /api/v1/auth/confirmemail/:emailConfirmToken
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
    success: false,
    msg: "Email successfully verified",
  });
};
