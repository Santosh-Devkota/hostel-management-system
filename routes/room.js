const express = require("express");
const authorize = require("../middleware/authorize");
const {
  getRooms,
  getRoomById,
  //getStudentsByRoomId,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controller/room");

router = express.Router();

router.post("/",authorize, createRoom);
router.put("/:id",authorize, updateRoom);
router.delete("/:id",authorize, deleteRoom);
// router.get("/", getRooms);
// router.get("/:id", getRoomById);


module.exports = router;
