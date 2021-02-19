const mongoose = require("mongoose");
const Student = require("../../model/student");
const DailyConsumption = require("../../model/MessModels/dailyConsumption");


//@route POST /mesh/dailyconsumption
exports.addStudentConsumption = async(req,res)=>{
    try {
        const result = await DailyConsumption.create(req.body);
    if(!result){
        return res.status(400).json({msg:"Unable to add consumption detail!"})
    }
    res.status(200).json({msg:"Added successfully!"})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Unable to add consumption detail!"})
    }
}



