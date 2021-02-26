const PaymentHistory = require("../../model/MessModels/paymentHistory");
const CurrentPayment = require("../../model/MessModels/currentPayment");
const Student = require("../../model/student");


//@route PUT /mess/payment/add
//Des update the current payment details
exports.makeNewPayment = async(req,res)=>{
    try {
        // Payment Received ... studentid... 
        //first updating the CurrentPayment details of the student
        const std = await Student.findById(req.body.studentId);
        if(!std){
            return res.status(404).json({msg:"Student not found!"});
        } else if(std.isInMesh){
            return res.status(400).json({msg:"The student doesn't belong to mess!"})
        }
        const currentDetail = await CurrentPayment.findOne({studentId:req.body.studentId});
        if(!currentDetail){
            return res.status(400).json({msg:"Current Payment details not found!"});
        }
        if(currentDetail.dueAmount !==0){
            currentDetail.dueAmount = currentDetail.dueAmount - req.body.paymentReceived;
        }
        currentDetail.save();
        // adding the payment record to the paymentHistory
        const paymentRecord = new PaymentHistory({
            studentId :req.body.studentId,
            paidAmount: req.body.paymentReceived,
            dueAmount :currentDetail.dueAmount,
        })
        paymentRecord.save();
        res.status(200).json({msg:"Payment Done successfully",data:paymentRecord});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Couldn't add the payment"})
    }
}

//@route GET /mess/payment/findpayment?query....
// std_id
// rollno
exports.findPaymentHistory = async(req,res)=>{
    try {
        if(req.query.std_id){
            const result = await PaymentHistory.find({studentId:req.query.std_id}).sort({"_id":-1});
            console.log(result);
            if(result.length === 0){ 
                return res.status(200).json({msg:"No payments made yet!"})
            }
            res.status(200).json({data:result});
        } else if(req.query.rollno){
            const student_id = await Student.findOne({rollNo:req.query.rollno}).select("_id");
            const result = await PaymentHistory.find({studentId:student_id}).sort({"_id":-1});
            if(result.length === 0){
                return res.status(200).json({msg:"No payments made yet!"})
            }
            res.status(200).json({data:result});
        } else {
            res.status(400).json({msg:"Check the payment search parameter!"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({msg:"Something went wrong!"})
    }
}
//@route PUT /mess/payment/updatepayment?query.......
//std_id
//payment_id
// exports.updateCurrentPaymentRecord = async(req,res)=>{
//     try {
//         if(req.query.std_id){
//             const result = await CurrentPayment.findOneAndUpdate({studentId:req.query.std_id},res.body,{
//                 new:true,
//                 runValidators:true
//             });
//             if(!result){
//                 return res.status(404).json({msg:"Couldn't update the payment details!"})
//             }
//             res.status(200).json({msg:"Update successful!",data:result});
//         } else if(req.query.payment_id){
//             const result = await CurrentPayment.findByIdAndUpdate(req.query.payment_id,res.body,{
//                 new:true,
//                 runValidators:true
//             });
//             if(!result){
//                 return res.status(404).json({msg:"Couldn't update the payment details!"})
//             }
//             res.status(200).json({msg:"Update successful!",data:result});
//         } else {
//             res.status(400).json({msg:"Check the payment update parameter!"});
//         }
//     } catch (error) {
//         console.log(error.message);
//         res.status(404).json({msg:"Couldn't update the payment details!"})
//     }
// }

//@route DELETE /mess/payment/delete/:id
exports.deletePaymentRecord = async(req,res)=>{
    try {
        const result = await CurrentPayment.findByIdAndDelete(req.params.id)
        if(!result){
            return res.status(404).json({msg:"Couldn't delete record!"});
        }
        res.status(200).json({msg:"Deleted successfully!"})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Couldn't delete the record!"});
    }
}
