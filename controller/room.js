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
    if(req.body.students.length != 0){
      // Promise.all resolves all the remaining promises so that you won't get promise object as return
      // to find if the student exist in the database
      // For example req.body.students = ["073BEX437","073....","....."] 
      const students = await Promise.all(req.body.students.map(async(studentName)=> {const student=  await Student.findOne({rollNo: studentName});
                                        return student;}));
      if(students.includes(undefined) || students.includes(null)){
        return res.status(400).json({msg: "One or more student(s) doesn't exist!"});
      }
     
      //determining the value of room field in student's record
      var studentsRoom = students.map((std) => std.room);

      // checking if the room is defined for that particular student
      if(!studentsRoom.includes(undefined)){
        return res.status(400).json({msg:"The student(s) is already assigned to a room"})
      }

      // assiging the student's ids to the req.body.students
      // req.body.students = ["73BEX..."] => req.body.students = ["365645323467"](id)
      req.body.students = students.map((student)=>student._id) ;
      
    }
    const createdRoom = await Room.create(req.body);
    // setting the "room" field in the student database
    await Promise.all(req.body.students.map(async(student_id)=>await Student.findByIdAndUpdate(student_id,{room:createdRoom._id})));
    res.status(200).json({
      data: createdRoom,
      msg:"Room created successfully!"
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({msg:"Unable to create the room!"})
  }
};


//@des      Get all the rooms
//@route    GET /rooms
//@access   Public
exports.getRooms = async (req, res) => {
  try {
    const result = await Room.find().sort({'_id':-1}).populate("student", "_id");
  if(result.length === 0){
    return res.status(400).json({msg:"No rooms to show!"})
  }
  res.status(200).json({
    data: result,
  });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({});
  }
};

exports.getRoomByRoomName = async (req, res) => {
  try {
    const result = await Room.findOne({roomName:req.params.roomname}).populate("student","rollNo fullName");
    if(!result){
      return res.status(404).json({msg:"No rooms found!"});
    }
  res.status(200).json({
    data: result,
  });
  } catch (error) {
    return res.status(400).json({});
  }
};

exports.getRoomsByBlock = async(req,res)=>{
  try {
    
    const rooms = await Room.find({block:req.params.block})
    if(rooms.length === 0){
      return res.status(404).json({msg:"No rooms found!"});
    }
    res.status(200).json({data:rooms})
  } catch (error) {
    console.log(error.message);
    res.status(400).json({msg:"Unable to show rooms"})
  }
}

//@des      Update a Room
//@route    PUT /rooms/:id
//@access   Private
exports.updateRoom = async (req, res) => {
  try {
    // req.body.students.length != 0 checks if there is any student provided for update in room
    if(req.body.students.length != 0){
      // For example req.body.students = ["073BEX437"] 
      // Promise.all resolves all the remaining promises so that you won't get promise object as return
      const students = await Promise.all(req.body.students.map(async(stdRoll)=> await Student.findOne({rollNo: stdRoll})));
      if(students.includes(null) || students.includes(undefined)){
        return res.status(400).json({msg: "The student(s) doesn't exist!"});
      }

      //determining the value of room field in student's record
      var studentsRoom = students.map((std) => std.room);

      // checking if the room is defined for that particular student
      if(!studentsRoom.includes(undefined)){
        return res.status(400).json({msg:"The student(s) is already assigned to a room"})
      }
      // IF not assigned continued to add the requested student to the room
      req.body.students = students.map((student)=>student._id) ;
    }
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedRoom) {
      return res.status(404).json({
        msg: 'Room not found.',
      });
    }
    // setting the "room" field in the student database
    await Promise.all(req.body.students.map(async(student_id)=>await Student.findByIdAndUpdate(student_id,{room:updatedRoom._id})));
    res.status(200).json({
      data: updatedRoom,
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
    // after deleting the room we should deleted that room from student database
    const students = await Student.find({room:req.params.id});
    students.map(async(std)=>{
      // unsetting the room field
      std.room = undefined;
        await std.save();
    })

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
      res.status(200).json({data:rooms});
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).json({});
  }
}




