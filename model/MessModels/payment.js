const mongoose = require("mongoose");
var Float = require('mongoose-float').loadType(mongoose, 2);

const paymentSchema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },
    newDueAmount:{
        type:Float,
    },
    lastDueAmount:{
        type:Float,
    },
    lastPaidAmount:{
        type:Float
    },
    lastPaidDate:{
        type:Date
    }
})

module.exports = mongoose.model("Payment",paymentSchema);