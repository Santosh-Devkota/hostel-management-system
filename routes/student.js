const express = require("express");
const authorize = require("../middleware/authorize");
const isAdmin = require("../middleware/isAdmin");
const {
  getStudents,
  getStudentById,
  //getStudentsByRoomId,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByFilter
} = require("../controller/student");

router = express.Router();

router.get("/students", getStudents);
router.get("/students/:id", getStudentById);
router.get("/filterstudents",getStudentByFilter);
//router.get("/category/:category", getStudentsByRoomId);
router.post("/students", [authorize,isAdmin], createStudent);
router.put("/students/:id", [authorize,isAdmin],updateStudent);
router.delete("/students/:id", [authorize,isAdmin],deleteStudent);

module.exports = router;
