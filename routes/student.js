const express = require("express");
const authorize = require("../middleware/authorize");
const adminAuth = require("../middleware/adminAuth");
const {
  getStudents,
  getStudentById,
  //getStudentsByRoomId,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controller/student");

router = express.Router();

router.get("/", getStudents);
router.get("/:id", getStudentById);
//router.get("/category/:category", getStudentsByRoomId);
router.post("/", authorize, createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;
