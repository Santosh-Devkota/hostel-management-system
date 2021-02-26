const express = require("express");
const authorize = require("../middleware/authorize");
const isAdmin = require("../middleware/isAdmin");
var path = require("path");
var appDir = path.dirname(require.main.filename);
const multer=require("multer");

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
    cb(null,appDir+"/public/gallery");
    },
    filename:(req,file,cb)=>{
        let filename=Date.now()+"_"+file.originalname;
            req.upload="/public/gallery/"+filename;
            cb(null,filename);
    }
});
const upload =multer({storage:storage});
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
router.put("/students/:id", [authorize,
  // upload.single("image")
],updateStudent);
router.delete("/students/:id", [authorize],deleteStudent);

module.exports = router;
