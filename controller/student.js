const { Student, validate } = require("../model/student");
const ErrorResponse = require("../utils/customError");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");

//@des      Get all the students
//@route    GET /api/v1/students
//@access   Public
exports.getStudents = async (req, res) => {
  const result = await Student.find();
  console.log(result);
  res.status(200).json({
    success: true,
    data: result,
  });
};

//@des      Get single the Student
//@route    GET /api/v1/students/:id
//@access   Public
exports.getStudentById = asyncMiddleware(async (req, res) => {
  //console.log(req.params.id);
  const result = await Student.findById(req.params.id);
  //console.log(result);
  if (!result) {
    //throw new ErrorResponse("NOT FOUND BITCH!", 404);
    res.status(404).json({
      success: true,
      msg: "not found bitch",
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
  // try {

  // } catch (error) {
  //   next(new ErrorResponse("Not found bitch!", 404));
  // }
});

//@des      Create new Student
//@route    POST /api/v1/students
//@access   Private
exports.createStudent = async (req, res) => {
  //const { error } = validate(req.body);
  //console.log(error);
  try {
    const result = await Student.create(req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(err.message);
    //console.log("this is error in db");
    // for (const field in err.errors) {
    //   console.log(err.errors[field].message);
    // }
  }
};

//@des      Update a Student
//@route    PUT /api/v1/students/:id
//@access   Private
exports.updateStudent = async (req, res) => {
  try {
    const result = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(result);
    if (!result) {
      res.status(404).json({
        success: false,
        msg: `Question with id:${req.params.id} not found!`,
      });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      success: false,
      msg: `Question with id:${req.params.id} not found!`,
    });
  }
};

//@des      Delete a Student
//@route    Delete /api/v1/questions/:id
//@access   Private
exports.deleteStudent = async (req, res) => {
  try {
    const result = await Student.findByIdAndDelete(req.params.id);
    console.log(result);
    if (!result) {
      res.status(404).json({
        success: false,
        msg: `Question with id:${req.params.id} not found!`,
      });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      success: false,
      msg: `Question with id:${req.params.id} not found!`,
    });
  }
};
