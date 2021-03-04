const express = require("express");
const authorize = require("../middleware/authorize");
const isAdmin = require("../middleware/isAdmin");
var path = require("path");
var appDir = path.dirname(require.main.filename);
const multer=require("multer");
const isMessStafforAdmin = require("../middleware/isMessStaffOrAdmin")
const isAnyStafforAdmin = require("../middleware/isAnyStafforAdmin");

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
    cb(null,appDir+"/public/gallery");
    },
    filename:(req,file,cb)=>{
        let filename=Date.now()+"_"+file.originalname;
            req.upload="/public/gallery/"+filename;
            console.log(filename);
            cb(null,filename);
    }
});

const resultStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
  cb(null,appDir+"/public/result/");
  },
  filename:(req,file,cb)=>{
      let filename=Date.now()+"_"+file.originalname;
          const imageUrl = "/result/"+filename;
          req.resultImageUrl.push(imageUrl)
          cb(null,filename);
  }
});

const upload =multer({storage:storage});
const uploadResult = multer({storage:resultStorage});
const {
  getStudents,
  getStudentByRollNo,
  //getStudentsByRoomId,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentByFilter,
  addResultImages
} = require("../controller/student");

router = express.Router();

router.get("/students",[authorize], getStudents);
router.get("/students/:rollno",[authorize], getStudentByRollNo);
router.get("/filterstudents",[authorize],getStudentByFilter);
//router.get("/category/:category", getStudentsByRoomId);
router.post("/students", [authorize,isAdmin], createStudent);
router.post("/student/result/uploadimages/:id",[authorize,isAdmin,
  uploadResult.array('image',10)
],addResultImages);
router.put("/students/:id", [authorize,
  upload.single("image")
],updateStudent);
router.delete("/students/:id", [authorize,isAdmin],deleteStudent);


module.exports = router;
