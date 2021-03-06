const express = require("express");
const authorize = require("../middleware/authorize");
const {
  getRooms,
  getRoomByRoomName,
  getRoomsByBlock,
  getVacantRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controller/room");

router = express.Router();

router.get("/",authorize, getRooms);
router.get("/namesearch/:roomname",authorize, getRoomByRoomName);
router.get("/blocksearch/:block",authorize, getRoomsByBlock);
router.get("/vacant",authorize,getVacantRooms);
router.post("/",authorize, createRoom);
router.put("/:id",authorize, updateRoom);
router.delete("/:id",authorize, deleteRoom);

module.exports = router;
