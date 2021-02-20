const Staff = require("../model/staff");

const isStaffOrAdmin = async(req,res)=>{
    if((req.user.role !== "admin") || (req.user.role !== "hostelstaff") ){
        return res.status(403).json({});
    }
    next();
}

module.exports = isStaffOrAdmin;