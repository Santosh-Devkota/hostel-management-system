const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const studentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      minlength: 5,
    },
    studentName: {
      type: String,
      required: true,
      minlength: 5,
    },
    address: {
      type: String,
    },
  }
  //{ _id: false }
);

function validateStudent(student) {
  const schema = Joi.object({
    _id: Joi.string().required().min(5),
    studentName: Joi.string().required().min(5).max(30),
    address: Joi.string().required().min(5),
  });

  return schema.validate(student);
}
exports.Student = mongoose.model("Student", studentSchema);
exports.validate = validateStudent;
