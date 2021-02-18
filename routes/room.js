const express = require("express");
const authorize = require("../middleware/authorize");
const {
  getRooms,
  getRoomByRoomName,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controller/room");

router = express.Router();

router.get("/",authorize, getRooms);
router.get("/:roomname",authorize, getRoomByRoomName);
router.post("/",authorize, createRoom);
router.put("/:id",authorize, updateRoom);
router.delete("/:id",authorize, deleteRoom);

module.exports = router;
