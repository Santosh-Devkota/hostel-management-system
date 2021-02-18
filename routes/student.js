const express = require("express");
const authorize = require("../middleware/authorize");
const isAdmin = require("../middleware/isAdmin");
const {
  getStudents,
  getStudentByRollNo,
  //getStudentsByRoomId,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByFilter
} = require("../controller/student");

router = express.Router();

router.get("/students", getStudents);
router.get("/students/:rollno", getStudentByRollNo);
router.get("/filterstudents",getStudentByFilter);
//router.get("/category/:category", getStudentsByRoomId);
router.post("/students", [authorize], createStudent);
router.put("/students/:id", [authorize],updateStudent);
router.delete("/students/:id", [authorize],deleteStudent);

module.exports = router;
