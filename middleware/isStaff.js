const Staff = require("../model/staff");

const isStaff = async(req,res)=>{
    if(req.user.role != "staff"){
        return res.status(403).json({});
    }
    next();
}

module.exports = isStaff;