const Notice = require("../model/notice");
const Staffs = require("../model/staff");
const Notification = require("../model/notification");
const Student = require("../model/student");

//@route GET /notice/search/latest?noticefrom=....
exports.getLatestNotice = async (req, res, next) => {
  try {
    if((req.query.noticefrom == "hostel")){
      req.body.roles = ["admin","hostelstaff"]
    }
    if(req.query.noticefrom == "mess"){
      req.body.roles= ["messstaff"];
    }
    const staffIdList = await Staffs.find({role:req.body.roles}).select("_id");
    const result = await Notice.find({staffId:{$in:staffIdList}}).sort({"_id":-1});
    // const result = await Notice.aggregate([{
      //populate({path:"staffId",match:{role:req.body.roles}})
    //   $lookup: {
    //     from: 'staffs',
    //     localField:"staffId",
    //     foreignField:"_id",
    //     as: 'Staffs',
    //     // let: { CompanyID: '$CompanyID' },
    //     // pipeline: [
    //     //   {
    //     //     $match: {
    //     //       $expr:{ $in: ['$Staffs.role', req.body.roles] }
    //     //     }
    //     //   }]
    //     }},
    //     { $sort : { date:-1 }}])
    if (result.length === 0) {
      return res.status(404).json({msg:"No notice(s) to show!"})
    }
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error.message)
    res.status(400).json({msg:"Couldn't show notice(s)!"})
  }
};


//@route Post /notice/add
exports.postNotice = async (req, res, next) => {
  try {
    req.body.staffId = req.user._id;
    const result = await Notice.create(req.body);
    if(!result){
      return res.status(400).json({msg:"Couldn't add the notice!"})
    }
    //////////////////////////////
    var notification ={};
    notification.contentId = result._id;
    notification.title = `${toTitleCase(req.user.role)} added a new notice! `;
    notification.notificationOf = "notice";
    const result1 = await Notification.create(notification);
    if(result1){
      const result2 = await Student.updateMany({},{hasNotification:true});
      const result3 = await Staffs.updateMany({},{hasNotification:true});
    }
    console.log(result1);
    res.status(200).json({
      msg:"Notice added succesfully!",
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({msg:"Couldn't add the notice!"});
  }
};

//@route PUT /notice/update/:id
exports.updateNotice = async(req,res)=>{
  try {
    const result = await Notice.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    });
    if(!result){
      return res.status(404).json({msg:"Notice with given id not found!"})
    }
    res.status(200).json({msg:"Update successful!",data:result});
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({msg:"Couldn't update!"})
  }
}
//@route Delte /notice/delete/:id
exports.deleteNotice = async(req,res)=>{
  try {
    const result = await Notice.findByIdAndDelete(req.params.id);
    const result1 = await Notification.findOneAndDelete({contentId:req.params.id});
    console.log(result);
    if(!result){
      return res.status(404).json({msg:"Notice with given id not found!"})
    }
    res.status(200).json({msg:"Delete successful!"});
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({msg:"Couldn't delete!"})
  }
}
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}