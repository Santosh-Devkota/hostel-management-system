isAdminorStudent = async(req,res)=>{
    if((req.user.role !== "admin") || (req.user.role !== "student")){
        return res.status(403).json({});
    }
    next();
}

module.exports = isAdminorStudent;