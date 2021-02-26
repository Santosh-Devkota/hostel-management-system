const mongoose = require("mongoose");
const Student = require("../../model/student");
const DailyConsumption = require("../../model/MessModels/dailyConsumption");
const PaymentHistory = require("../../model/MessModels/paymentHistory");
const CurrentPayment = require("../../model/MessModels/currentPayment");
const FoodItem = require("../../model/MessModels/foodItem");


//@route POST /mess/dailyconsumption
exports.addStudentConsumption = async(req,res)=>{
    try {
        await Promise.all(req.body.map(async(consumption)=>{
            const result = await DailyConsumption.create(consumption)
            // calculating the cost the consumed food

            const costList = await Promise.all(consumption.foodDetails.map(async(food)=>{
                const result = await FoodItem.findById(food.foodId)
                const price = result.price;
                return price*food.count;
            }));
            const totalAmount = costList.reduce((a, b) => a + b, 0)
            
            const currentStudentPayment = await CurrentPayment.findOne({studentId:consumption.studentId});
            currentStudentPayment.dueAmount = currentStudentPayment.dueAmount+ totalAmount;
            await currentStudentPayment.save();
        }));
    res.status(200).json({msg:"Consumption successfully added!"})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Unable to add consumption detail!"})
    }
}
//@route GET /mess/enrolledstudents/all
exports.getEnrolledMembers = async(req,res)=>{
    try {
        const results = await Student.find({isInMess:true}).sort({"_id":-1});
        if(results.length === 0){
            return res.status(200).json({msg:"No students enrolled!",data:results})
        }
        res.status(200).json({data:results});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Unable to search enrolled members!"})
    }
}
//@route PUT /mess/enrollremove/:rollno?mess=true/false
exports.enrollRemoveFromMess = async(req,res)=>{
    try {
        // converting string "true/false" to Boolean value
        req.query.mess = JSON.parse(req.query.mess.toLowerCase());
        const student = await Student.findOneAndUpdate({rollNo:req.params.rollno},{isInMess:req.query.mess},
            {new:true,runValidators:true});
        if(!student){
            return res.status(404).json({msg:"Student record not found!"});
        }
        var message;
        if(req.query.mess){
            // to create a record for current payment of enrolled student
            const newCurrentPaymentRecord = new CurrentPayment({
                studentId : student._id,
                dueAmount:0
            })
            await newCurrentPaymentRecord.save();
            message = "Enrolled in mess!"
        } else{
            const result1 = await CurrentPayment.deleteMany({studentId:student._id});
            const result2 = await PaymentHistory.deleteMany({studentId:student._id});
            const result3 = await DailyConsumption.deleteMany({studentId:student._id});
            message = "Removed from mess!";
        }
        res.status(200).json({msg:message});

    } catch (error) {
        console.log(error.message);
        res.status(404).json({msg:"Couldn't perform the action!"});
    }
}



