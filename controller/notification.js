const Notification = require("../model/notification");
const Staffs = require("../model/staff");
const Student = require("../model/student");

//@route GET 
exports.getLatestNotification = async(req,res)=>{
    try {
        const result = await Notification.find().sort({"_id":-1}).limit(10);
        console.log(result)
        if(result.length === 0){
            return res.status(200).json({msg:"No notifications to show!"})
        }
        res.status(200).json({data:result})
    } catch (error) {
        console.log(error.message);
        res.status(404).json({msg:"Unable to show notification!"});
    }
}


//@route PUT /notification/turnoff/:id
exports.turnOffNotification = async(req,res) =>{
    try {
        const staff = await Staffs.findById(req.params.id);
        if(!staff){
            const student = await Student.findById(req.params.id);
            if(!student){
                return res.status(400).json({msg:"User with given id not found!"});
            }
            student.hasNotification = false;
            await student.save();
            res.status(200).json({});
        }
        staff.hasNotification = false;
        await staff.save();
        res.status(200).json({});
    } catch (error) {
        console.log(error.message);
        res.status(404).json({msg:"Unable to turn off notification"});
    }
}