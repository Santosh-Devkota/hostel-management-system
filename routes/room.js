const express = require("express");
const {
  getRooms,
  getRoomById,
  //getStudentsByRoomId,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controller/room");

router = express.Router();

router.get("/", getRooms);
router.get("/:id", getRoomById);
//router.get("/category/:category", getStudentsByRoomId);
router.post("/", createRoom);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

module.exports = router;
