const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { model } = require("./room");
const staffSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 5,
    maxlength: 50,
    unique:true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 50,
  },
  password: {
    type: String,
    select: false,
    minlength: 5,
    maxlength: 500,
  },
  phoneNo:{
    type:String,
    maxlength:10,
  },
  role: {
    type:String,
    enum:['admin','hostelstaff',"messstaff"],
    default:'hostelstaff'
  },
  isPasswordChanged:{
    type:Boolean,
    default:false
  },
  imageUrl:{
    type:String,
  },
  hasNotification:{
    type:Boolean,
    default:false
  },
  fullName:{
    type:String,
    required:true,
  },
  contact:{
    type:String,
    required:true,
  },
  address:{
    type:String,
  }
  // resetPasswordToken: String,
  // resetPasswordExpire: Date,
  // emailConfirmToken: String,
  // emailConfirmExpire: Date,
});

// Encrypt password using bcrypt
// staffSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

staffSchema.methods.generateAuthToken = function () {
  try {
    const token = jwt.sign({_id:this._id,role:this.role,email:this.email,isPasswordChanged:this.isPasswordChanged},
      process.env.JWT_SECRETKEY,
      {
        expiresIn: 86400, //the token expires in 24hr
      }
    );
    return token;
  } catch (error) {
    console.log(error)
  }
  
};

// staffSchema.methods.getResetPasswordToken = function () {
//   //Generating Token
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   //Hash token and set to resetPasswordToken field of user database
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   //set expire time for reset token
//   if (user.isVerified) {
//     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
//   }
//   return resetToken;
// };
// staffSchema.methods.getEmailConfirmationToken = function () {
//   //Generating Token
//   const confirmToken = crypto.randomBytes(20).toString("hex");

//   //Hash token and set to resetPasswordToken field of user database
//   this.emailConfirmToken = crypto
//     .createHash("sha256")
//     .update(confirmToken)
//     .digest("hex");

//   //set expire time for reset token
//   this.emailConfirmExpire = Date.now() + 24 * 60 * 60 * 1000;

//   return confirmToken;
// };

module.exports = mongoose.model("Staffs", staffSchema);
