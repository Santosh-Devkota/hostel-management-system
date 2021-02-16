const Student = require("../model/student");
const ErrorResponse = require("../utils/customError");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const Room = require("../model/room");

//@des      Get all the students
//@route    GET /students
//@access   Public
exports.getStudents = async (req, res) => {
  const result = await Student.find().sort({'_id': -1})
  .limit(10);
  // remember find() always gives array && it gives empty array if no data exits
  res.status(200).json({
    success: true,
    data: result,
  });
};

//@des      Get single the Student
//@route    GET /students/:id
//@access   Public
exports.getStudentById = async (req, res) => {
  const result = await Student.findOne({username:req.params.id});
  if (!result) {
   return res.status(404).json({
      success: true,
      msg: "not found bitch",
    });
  }
  res.status(200).json({
    success: true,
    data: result,
  });
};

//@des Get students by query params
//@route get /filterstudents?block=A&batch073&faculty=BEX
// filters 1) Room Block 2)Batch 3)Faculty
//@access private 
exports.getStudentByFilter = async(req,res)=>{
  // try {
  //   const {block,batch,faculty} = req.query;
  //   if(block){
  //     const rooms = await Room.find({block:block});
  //     const students = rooms.map((room){
  //       if(room.student)
  //     })
  //   }
  // } catch (error) {
    
  // }

  try {
    const {batch,faculty} = req.query;
    if(batch && faculty){
      const student = await Student.find({batch:batch,faculty:faculty}) 
      if(student.length ==0){
        res.status(404).json({msg:"No such records"});
      }
      res.status(200).json({success:true,data:student});
    } else if(batch){
      const student = await Student.find({batch:batch});
      if(student.length ==0){
        res.status(404).json({msg:"No such records"});
      }
      res.status(200).json({success:true,data:student});
    } else if(faculty){
      const student = await Student.find({faculty});
      if(student.length ==0){
        res.status(404).json({msg:"No such records"});
      }
      res.status(200).json({success:true,data:student});
    }
  } catch (error) {
    
  }
}

//@des      Create new Student
//@route    POST /students
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
//@route    PUT /students/:id
//@access   Private
exports.updateStudent = async (req, res) => {
  try {
    const result = await Student.findOneAndUpdate({username:req.params.id}, req.body, {
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
//@route    Delete /questions/:id
//@access   Private
exports.deleteStudent = async (req, res) => {
  try {
    const result = await Student.findOneAndDelete({username:req.params.id});
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

