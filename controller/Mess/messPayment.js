const { query } = require("express");
const Payment = require("../../model/MessModels/payment");


//@route POST /mess/payment/addnew
exports.addNewPayment = async(req,res)=>{
    try {
        const payment = await Payment.findOne({studentId:req.body.studentId})
        if(payment){
            return res.status(404).json({msg:`The paymentdetails for studentId:{req.body.studentId} already exits!`,data:payment});
        }
        const result = await Payment.create(req.body);
        if(!result){
            return res.status(400).json({msg:"Couldn't add the payment"});
        }
        res.status(200).json({msg:"Payment details added!",data:result});
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Couldn't add the payment"})
    }
}

//@route GET /mess/payment/findpayment?query....
// std_id
// payment_id
exports.findPayment = async(req,res)=>{
    try {
        if(req.query.std_id){
            const result = await Payment.findOne({studentId:req.params.std_id});
            if(!result){ 
                return res.status(404).json({msg:"Couldn't find the payment details!"})
            }
            res.status(200).json({data:result});
        } else if(req.query.payment_id){
            const result = await Payment.findById(req.query.payment_id);
            if(!result){
                return res.status(404).json({msg:"Couldn't find the payment details!"})
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
exports.updatePayment = async(req,res)=>{
    try {
        if(req.query.std_id){
            const result = await Payment.findOneAndUpdate({studentId:req.query.std_id},res.body,{
                new:true,
                runValidators:true
            });
            if(!result){
                return res.status(404).json({msg:"Couldn't update the payment details!"})
            }
            res.status(200).json({msg:"Update successful!",data:result});
        } else if(req.query.payment_id){
            const result = await Payment.findByIdAndUpdate(req.query.payment_id,res.body,{
                new:true,
                runValidators:true
            });
            if(!result){
                return res.status(404).json({msg:"Couldn't update the payment details!"})
            }
            res.status(200).json({msg:"Update successful!",data:result});
        } else {
            res.status(400).json({msg:"Check the payment update parameter!"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({msg:"Couldn't update the payment details!"})
    }
}

//@route DELETE /mess/payment/delete/:id
exports.deletePaymentById = async(req,res)=>{
    try {
        const result = await Payment.findByIdAndDelete(req.params.id)
        if(!result){
            return res.status(404).json({msg:"Couldn't delete payment!"});
        }
        res.status(200).json({msg:"Deleted successfully!"})
    } catch (error) {
        console.log(error.message);
        res.status(400).json({msg:"Couldn't delete the payment!"});
    }
}
