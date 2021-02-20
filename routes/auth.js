const express = require("express");
const authorize = require("../middleware/authorize");
// const isAdmin = require("../middleware/isAdmin");
// const isStaff = require("../middleware/isHostelStaff");

const {
  registerStaff,
  loginUser,
  currentUser,
  initialStdPasswordReset,
  resetPassword,
} = require("../controller/auth");
const isAdmin = require("../middleware/isAdmin");

router = express.Router();

router.post("/register/staff",registerStaff)
router.post("/login", loginUser);
router.get("/me", [authorize], currentUser);
router.put("/initstdpasswordreset",authorize,initialStdPasswordReset)
router.put("/resetpassword/:resetId",[authorize,isAdmin], resetPassword);


module.exports = router;
