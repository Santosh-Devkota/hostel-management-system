const Room = require("../model/room");
const Student = require("../model/student");


//@des      Create new Room
//@route    POST /rooms
//@access   Private
exports.createRoom = async (req, res) => {
  try {
    const room  = await Room.findOne({roomName: req.body.roomName});
    if(room){
      res.status(400).json({
        msg:"Room already exists."
      })
    }
    if(req.body.student.length != 0){
      // Promise.all resolves all the remaining promises so that you won't get promise object as return
      const students = await Promise.all(req.body.student.map(async(userName)=> {const student=  await Student.findOne({username: userName});
      return student;}));

      if(!students){
        return res.status(400).json({success: false, msg: "The student(s) doesn't exist!"});
      }
      req.body.student = students.map((student)=>student._id) ;
    }
    const result = await Room.create(req.body);
    res.status(200).json({
      data: result,
      msg:"Room created successfully!"
    });
  } catch (err) {
    console.log(err);
  }
};


//@des      Update a Room
//@route    PUT /rooms/:id
//@access   Private
exports.updateRoom = async (req, res) => {
  try {

    if(req.body.student.length != 0){
      // Promise.all resolves all the remaining promises so that you won't get promise object as return
      const students = await Promise.all(req.body.student.map(async(userName)=> await Student.findOne({username: userName})));

      console.log(students);
      if(students.includes(null)){
        return res.status(400).json({success: false, msg: "The student(s) doesn't exist!"});
      }
      const studentIds = students.map((student)=>student._id);
      const result = await Room.findOne({student:studentIds});
      console.log(result);
      if(result){
        return res.status(400).json({success:false, msg: "The student(s) is already assigned!"});
      }
      req.body.student = studentIds ;
    }


    const result = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return res.status(404).json({
        msg: 'Room not found.',
      });
    }
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      msg: "Couldn't update the room",
    });
  }
};

exports.deleteRoom = async(req,res)=>{
  try{
    const result = await Room.findOneAndDelete({_id: req.params.id});
    if(!result){
      res.status(404).json({msg:"Room not found."})
    }
    res.status(200).json({msg:"Room deleted."});
  }
  catch(error){
    console.log(error.message);
    res.status(400).json({msg:"Couldn't delete the room"});
  }
}




//@des      Get all the rooms
//@route    GET /rooms
//@access   Public
exports.getRooms = async (req, res) => {
  const result = await Room.find().populate("student", "-_id");
  res.status(200).json({
    success: true,
    data: result,
  });
};

//@des      Get single the Room
//@route    GET /api/v1/rooms/:id
//@access   Public
exports.getRoomById = async (req, res) => {
  console.log(req.params.id);
  const result = await Room.findById(req.params.id).populate("student");
  res.status(200).json({
    data: result,
  });
};
