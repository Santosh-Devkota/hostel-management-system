const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema(
  {
    username:{
      type:String,
      required:true,
      minlength:5,
      unique:true
    },
    fullName:{
      type:String,
      required:true,
      minlength:5
    },
    password:{
      type:String,

    },
    isPasswordChanged:{
      type: Boolean,
      default: false
    },
    faculty:{
      type:String,
      required:true,
      
    },
    dob:{
      type:String,
      required:true
    },

    address:{
      type:String,
      required:true,
      
    },
    contact:{
      type:String,
      required:true,
    },
    batch:{
      type:String,
      required:true,
    },
    email:{
      type:String,
      required:true,
    }
  }
);
studentSchema.methods.generateAuthToken = function () {
  try {
    const token = jwt.sign({_id:this._id,role:this.role},
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

// function validateStudent(student) {
//   const schema = Joi.object({
//     _id: Joi.string().required().min(5),
//     studentName: Joi.string().required().min(5).max(30),
//     address: Joi.string().required().min(5),
//   });

//   return schema.validate(student);
// }
module.exports = mongoose.model("Student", studentSchema);
