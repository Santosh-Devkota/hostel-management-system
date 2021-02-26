const Student = require("../model/student");
var fs = require("fs");
var path = require("path");
var appDir = path.dirname(require.main.filename);
const ErrorResponse = require("../utils/customError");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const Room = require("../model/room");
var generator = require('generate-password');
const CurrentPayment = require("../model/MessModels/currentPayment");
const PaymentHistory = require("../model/MessModels/paymentHistory");

//@des      Get all the students
//@route    GET /students
//@access   Public 
exports.getStudents = async (req, res) => {
  const result = await Student.find().sort({'_id': -1})
  .limit(10);
  // remember find() always gives array && it gives empty array if no data exists
  res.status(200).json({
    data: result,
  });
};

//@des      Get single the Student
//@route    GET /students/:id
//@access   Public
exports.getStudentByRollNo = async (req, res) => {
  const result = await Student.findOne({rollNo:req.params.rollno});
  if (!result) {
   return res.status(404).json({
      msg: "not found bitch",
    });
  }
  res.status(200).json({
    data: result,
  });
};

//@des Get students by query params
//@route get /filterstudents?block=A&batch073&faculty=BEX
// filters 1) Room Block 2)Batch 3)Faculty
//@access private 
exports.getStudentByFilter = async(req,res)=>{
  try {
    const {batch,faculty} = req.query;
    let query = {};
  //  if(block) {query.block = req.query.block};
    if(batch) {query.batch = req.query.batch};
    if(faculty) {query.faculty = req.query.faculty};
    const student = await Student.find(query).populate({path:"room",match:{block:req.query.block}});
      if(student.length ==0){
        res.status(404).json({msg:"No such records"});
      }
      res.status(200).json({data:student});
  } catch (error) {
    res.status(404).json({});
  }
}

//@des      Create new Student
//@route    POST /students
//@access   Private
exports.createStudent = async (req, res) => {
  try {
    // let me first finish the works realted to room BUT if the room is sent in request
    if(req.body.room){
        const room = await Room.findOne({roomName:req.body.room});
        if(!room){
          return res.status(404).json({msg:"The room doesn't exist"})
        }
        /// check if the room is already assigned to the user
        req.body.room = room._id;
    }
    req.body.password = generator.generate({
      length: process.env.PASSWORD_SIZE,
      numbers: true
  });
  //gotcha
  const result  = await Student.findOne({rollNo:req.body.rollno});
    if(result){
      return res.status(400).json({msg: "The student already exists!"});
    }
    req.body.faculty = req.body.faculty.toUpperCase(); 
    const student = await Student.create(req.body);
    res.status(200).json({data:student});
  } catch (err) {
    console.log(err.message);
    res.status(400).json({msg:"Unable to create student!"});
  }
};

//@des      Update a Student
//@route    PUT /students/:id
//@access   Private
exports.updateStudent = async (req, res) => {
  try {
    // req.body.imageUrl = req.upload;
    const result = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      res.status(404).json({
        msg: `Student with id:${req.params.id} not found!`,
      });
    }
    res.status(200).json({
      msg:"Updated Successfully",
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    fs.unlinkSync(appDir + req.upload);
    res.status(404).json({
      msg: "Unable to delete the student!",
    });
  }
};

//@des      Delete a Student
//@route    Delete /questions/:id
//@access   Private
exports.deleteStudent = async (req, res) => {
  try {
    const result = await Student.findOneAndDelete(req.params.id);
    if(result){
      // deleting the student's record from the respective room
      const operationResult = await Room.updateOne({students:req.params.id},{$pull:{students:req.params.id}})
      // deleting the student record from mess
      const result1 = await CurrentPayment.findOneAndDelete({studentId:req.params.id});
      const result2 = await PaymentHistory.deleteMany({studentId:req.params.id});
    }
    if (!result) {
      res.status(404).json({
        msg: `Student with id:${req.params.id} not found!`,
      });
    }
    res.status(200).json({
      msg:"Student deleted Successfully!"
    });

  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      msg: "Couldn't delete the student!",
    });
  }
};

