const express = require("express");
const authorize = require("../middleware/authorize");
// const isAdmin = require("../middleware/isAdmin");
// const isStaff = require("../middleware/isHostelStaff");

const {
  registerStaff,
  loginUser,
  currentUser,
  initialPasswordReset,
  resetPassword,
  getLoginDetails,
} = require("../controller/auth");
const isAdmin = require("../middleware/isAdmin");

router = express.Router();

router.post("/register/staff",registerStaff)
router.post("/login", loginUser);
router.get("/me", [authorize], currentUser);
router.get("/logindetails",[authorize,isAdmin],getLoginDetails);
router.put("/initialpasswordreset",authorize,initialPasswordReset)
router.put("/resetpassword/:resetId",[authorize,isAdmin], resetPassword);

module.exports = router;
