const mongoose = require("mongoose");
var Float = require('mongoose-float').loadType(mongoose, 2);

const currentPaymentSchema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true},
    dueAmount:{
        type:Float,
        required:true
    }
})

module.exports = mongoose.model("CurrentPayment",currentPaymentSchema);