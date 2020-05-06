const Room = require("../model/room");

//@des      Get all the rooms
//@route    GET /api/v1/rooms
//@access   Public
exports.getRooms = async (req, res) => {
  const result = await Room.find().populate("student", "-_id");
  console.log(result);
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
  const result = await Room.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: result,
  });
};

//@des      Get 10 random the questions from specific category
//@route    GET /api/v1/questions/category/:category
//@access   Public
// exports.getQuestionByCategory = async (req, res) => {
//   const result = await Room.find({
//     category: [req.params.category],
//   });
//   console.log(result);
//   res.status(200).json({
//     success: true,
//     data: result,
//   });
// };

//@des      Create new Room
//@route    POST /api/v1/rooms
//@access   Private
exports.createRoom = async (req, res) => {
  console.log(req.body);
  try {
    const result = await Room.create(req.body);
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

//@des      Update a Room
//@route    PUT /api/v1/rooms/:id
//@access   Private
exports.updateRoom = async (req, res) => {
  try {
    const result = await Room.findByIdAndUpdate(req.params.id, req.body, {
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

//@des      Delete a Room
//@route    Delete /api/v1/questions/:id
//@access   Private
exports.deleteRoom = async (req, res) => {
  try {
    const result = await Room.findByIdAndDelete(req.params.id);
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
