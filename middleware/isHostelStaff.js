const Staff = require("../model/staff");

const isHostelStaff = async(req,res)=>{
    if(req.user.role != "hostelstaff"){
        return res.status(403).json({});
    }
    next();
}

module.exports = isHostelStaff;