const isAnyStafforAdmin = async(req,res)=>{
    if((req.user.role !== "admin") || (req.user.role !== "messstaff") || (req.user.role !== "hostelstaff")){
        return res.status(403).json({});
    }
    next();
}

module.exports = isAnyStafforAdmin;