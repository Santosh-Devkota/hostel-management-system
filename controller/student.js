const Student = require("../model/student");
const ErrorResponse = require("../utils/customError");
const { asyncMiddleware } = require("../middleware/asyncMiddleware");
const Room = require("../model/room");
var generator = require('generate-password');

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
  try {
    const {block,batch,faculty} = req.query;
    let query = {};
   // if(block) {query.block = req.query.block};
    if(batch) {query.batch = req.query.batch};
    if(faculty) {query.faculty = req.query.faculty};
    const student = await Student.find(query) 
      if(student.length ==0){
        res.status(404).json({msg:"No such records"});
      }
      res.status(200).json({success:true,data:student});
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
      length: 10,
      numbers: true
  });
  //gotcha
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
    const result = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(result);
    if (!result) {
      res.status(404).json({
        success: false,
        msg: `Student with id:${req.params.id} not found!`,
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
    //find the student record and determining the "room_id";

    // const std = await Student.findById(req.params.id);
    // const room_id = std.room;
    // const delStd_id = std._id;
    const result = await Student.findOneAndDelete(req.params.id);
    // if (!result || !std) {
    //   res.status(404).json({
    //     success: false,
    //     msg: `Student with id:${req.params.id} not found!`,
    //   });
    // }
    if (!result) {
      res.status(404).json({
        success: false,
        msg: `Student with id:${req.params.id} not found!`,
      });
    }
    // delete that student's record from the 'Room' table

    // const deletedStdRoom = await Room.findById(room_id);
    // const totalRoomStd = deletedStdRoom.student;
    // const filteredRoomStd = totalRoomStd.filter((std)=> std!==delStd_id);
    // const reslt = await Room.findByIdAndUpdate(room_id,filteredRoomStd,{
    //   new:true,
    //   runValidators:true
    // })

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

