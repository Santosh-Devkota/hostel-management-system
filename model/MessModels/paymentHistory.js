const mongoose = require("mongoose");
var Float = require('mongoose-float').loadType(mongoose, 2);

const paymentHistorySchema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },
    dueAmount:{
        type:Float,
    },
    paidAmount:{
        type:Float,
    },
    paidDate:{
        type:Date
    }
})

module.exports = mongoose.model("PaymentHistory",paymentHistorySchema);