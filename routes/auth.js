const express = require("express");
const authorize = require("../middleware/authorize");
const authAdmin = require("../middleware/adminAuth");
const {
  // getUsers,
  //getStudentById,
  //getStudentsByRoomId,
  registerAdministration,
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
router.post("/register/student", registerStudent);
router.post("/register/administration",registerAdministration)
router.post("/login",authAdmin, loginUser);
router.get("/me", [authorize, authAdmin], currentUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.get("/confirmemail/:emailconfirmtoken", confirmEmail);
//router.put("/:id", updateUser);
//router.delete("/:id", deleteUser);

module.exports = router;
