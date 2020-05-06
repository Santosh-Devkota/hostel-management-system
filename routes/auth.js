const express = require("express");
const authorize = require("../middleware/authorize");
const authAdmin = require("../middleware/adminAuth");
const {
  // getUsers,
  //getStudentById,
  //getStudentsByRoomId,
  registerUser,
  loginUser,
  currentUser,
  forgotPassword,
  resetPassword,
  //updateUser,
  // deleteUser,
} = require("../controller/auth");

router = express.Router();

//router.get("/", getUsers);
//router.get("/:id", getStudentById);
//router.get("/category/:category", getStudentsByRoomId);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", [authorize, authAdmin], currentUser);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
//router.put("/:id", updateUser);
//router.delete("/:id", deleteUser);

module.exports = router;
