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
      // to find if the student exist in the database
      const students = await Promise.all(req.body.student.map(async(studentName)=> {const student=  await Student.findOne({username: studentName});
      return student;}));
      
      if(!students){
        return res.status(400).json({success: false, msg: "The student(s) doesn't exist!"});
      }

      // to check if the student to be added is already assigned to the room
      const isAssignedToRoom = students.map(studentObj => {
        //checking if the room property exist in that student
        // if there is room property the student is already assigned to the room
        if(typeof studentObj.room !== undefined){
          return true;
        }
        return false;
      })
      if(isAssignedToRoom.includes(true)){
        return res.status(400).json({msg:"The student(s) is already assigned!"})
      }
      // IF not assigned continued to add the room
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

exports.getRoomByRoomName = async (req, res) => {
  try {
    const result = await Room.findOne({roomName:req.params.roomname}).populate("student");
    if(!result){
      return res.status(404).json({msg:"No such rooms!"});
    }
  res.status(200).json({
    data: result,
  });
  } catch (error) {
    return res.status(400).json({});
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
      if(students.includes(null)){
        return res.status(400).json({success: false, msg: "The student(s) doesn't exist!"});
      }
      const studentIds = students.map((student)=>student._id);
      const result = await Room.findOne({student:studentIds});
      console.log(result);
      if(result){
        return res.status(400).json({success:false, msg: "The student(s) is already assigned!"});
      }
      // to check if the student to be added is already assigned to the room
      const isAssignedToRoom = students.map(studentObj => {
        //checking if the room property exist in that student
        // if there is room property the student is already assigned to the room
        if(typeof studentObj.room !== undefined){
          return true;
        }
        return false;
      })
      if(isAssignedToRoom.includes(true)){
        return res.status(400).json({msg:"The student(s) is already assigned!"})
      }
      // IF not assigned continued to add the room
      req.body.student = students.map((student)=>student._id) ;
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
    const result = await Room.findByIdAndDelete(req.params.id);
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


exports.filterRooms = async(req,res)=>{
  try {
    const {block} = req.query;
    if(block){
      const rooms = await Room.find({block:req.query.block});
      if(rooms.length == 0){
        res.status(400).json({msg:"No rooms found!"});
      }
      res.status(200).json({success:true,data:rooms});
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).json({});
  }
}




