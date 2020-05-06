const bcrypt = require("bcrypt");
const { User } = require("../model/user");
const ErrorResponse = require("../utils/customError");
const sendEmail = require("../utils/sendEmail");
//const jwt = require("jsonwebtoken");
const crypto = require("crypto");
exports.registerUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(new ErrorResponse("User already exists", 404));
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();
    res.status(200).json({
      success: true,
      msg: result,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorResponse("Unable to create username", 404));
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user) {
      return next(new ErrorResponse("Invalid Email or password", 400));
      //   res.status(400).json({
      //     success: false,
      //     msg: "Invalid email or password",
      //   });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      //next(new ErrorResponse("Invalid password ", 400));
      return res.status(400).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    sendTokenInCookieResponse(user, 200, res);
    //sending token in response header
    // res.header("x-auth-token", token).status(200).json({
    //   success: true,
    //   //token: token,
    // });
  } catch (error) {
    console.log(error.message);
    next(new ErrorResponse("something went wrong", 404));
  }
};

function sendTokenInCookieResponse(user, statusCode, res) {
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
