const express = require("express");
const authorize = require("../middleware/authorize");
// const isAdmin = require("../middleware/isAdmin");
// const isStaff = require("../middleware/isHostelStaff");
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
  registerStaff,
  loginUser,
  // currentUser,
  initialPasswordReset,
  resetPassword,
  getLoginDetails,
  findStaffByUsername,
  findAllStaffs,
  updateStaffDetails,
  deleteStaff,
  getLoginDetailsByUsername,
} = require("../controller/auth");
const isAdmin = require("../middleware/isAdmin");

router = express.Router();

router.post("/register/staff",[authorize,isAdmin],registerStaff)
router.post("/login", loginUser);
router.get("/find/staff/:username",[authorize,isAdmin],findStaffByUsername);
router.get("/findall/staff",[authorize,isAdmin],findAllStaffs)

router.put("/update/staff/:id",[authorize,isAdmin,
  // upload.single("image")
],updateStaffDetails);
// router.get("/me", [authorize], currentUser);
router.get("/logindetails",[authorize,isAdmin],getLoginDetails);
router.get("/logindetails/search/:username",[authorize,isAdmin],getLoginDetailsByUsername);
router.put("/initialpasswordreset",authorize,initialPasswordReset)
router.put("/resetpassword/:resetId",[authorize,isAdmin], resetPassword);
router.delete("/delete/staff/:id",[authorize,isAdmin],deleteStaff);

module.exports = router;


//@route GET /auth/find/staff/:username
exports.findStaffByUsername = async(req,res)=>{
  try {
   const staff = await Staffs.findOne({username:req.params.username});
   if(!staff){
     return res.status(404).json({msg:"No staffs found!"});
   }
   res.status(200).json({data:staff});
   
  } catch (error) {
    console.log(error.message);
    res.status(400).json({msg:"Unable to find staff"});
  }
 }
 
 //@route PUT /auth/update/staff/:id
 exports.updateStaffDetails = async(req,res)=>{
   try {
     req.body.imageUrl = req.upload;
     const result = await Staffs.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
     if(!result){
       return res.status(404).json({msg:"Staff with given id not found!"});
     }
     res.status(200).json({msg:"Updated Successfully!",data:result});
   } catch (error) {
     console.log(error.message);
     fs.unlinkSync(appDir + req.upload);
     res.status(400).json({msg:"Couldn't update/upload!"});
   }
 }
 
 
 
 //@route Delete /auth/delete/staff/:id
 exports.deleteStaff = async(req,res)=>{
   try {
     const result1 = await Staffs.findByIdAndDelete(req.params.id);
     if(!result1){
       return res.status(404).json({msg:"Staff with given id not found!"});
     }
     res.status(200).json({msg:"Staff delete successful!"});
   } catch (error) {
     console.log(error.message);
     res.status(400).json({msg:"Unable to delete the message!"});
   }
 }