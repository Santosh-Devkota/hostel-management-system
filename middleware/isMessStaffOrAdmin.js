const Staff = require("../model/staff");

const isMessStaffOrAdmin = async(req,res)=>{
    if((req.user.role !== "admin") || (req.user.role !== "messstaff") ){
        return res.status(403).json({});
    }
    next();
}

module.exports = isMessStaffOrAdmin;