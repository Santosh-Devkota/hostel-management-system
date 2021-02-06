const Student = require("../model/student");
const ErrorResponse = require("../utils/customError");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");

//@des      Get all the students
//@route    GET /api/v1/students
//@access   Public
exports.getStudents = async (req, res) => {
  const result = await Student.find();
  // remember find() always gives array && it gives empty array if no data exits
  res.status(200).json({
    success: true,
    data: result,
  });
};

//@des      Get single the Student
//@route    GET /api/v1/students/:id
//@access   Public
exports.getStudentById = asyncMiddleware(async (req, res) => {
  const result = await Student.findById(req.params.id);
  if (!result) {
    res.status(404).json({
      success: true,
      msg: "not found bitch",
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
});

//@des      Create new Student
//@route    POST /api/v1/students
//@access   Private
exports.createStudent = async (req, res) => {
  try {
    const result  = await Student.findOne({username:req.body.username});
    if(result){
     return res.status(400).json({success:false, msg: "The user already exists!"});
    }
    const student = await Student.create(req.body);
    res.status(200).json({success:true,data:student});
    
  } catch (err) {
    console.log(err.message);
    res.status(400).json({success:false, msg:"Unable to create user!"});


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
