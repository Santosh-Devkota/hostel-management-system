const express = require("express");
const authorize = require("../middleware/authorize");
const isAdmin = require("../middleware/isAdmin");
const isStaff = require("../middleware/isStaff");
const {
  // getUsers,
  //getStudentById,
  //getStudentsByRoomId,
  registerStaff,
  registerStudent,
  loginUser,
  currentUser,
  forgotPassword,
  resetPassword,
  confirmEmail,
  //updateUser,
  // deleteUser,
} = require("../controller/auth");

router = express.Router();
//router.get("/", getUsers);
//router.get("/:id", getStudentById);
//router.get("/category/:category", getStudentsByRoomId);
router.post("/register/student",[authorize], registerStudent);
router.post("/register/staff",registerStaff)
router.post("/login", loginUser);
router.get("/me", [authorize], currentUser);
// router.put("/forgotpassword", forgotPassword);
router.put("/resetpassword",[authorize], resetPassword);
// router.put("/resetpassword/:resettoken",[authorize,isisAdmin], resetPassword);
// router.get("/confirmemail/:emailconfirmtoken", confirmEmail);
//router.put("/:id", updateUser);
//router.delete("/:id", deleteUser);

module.exports = router;
