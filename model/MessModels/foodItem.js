const mongoose = require("mongoose");
var Float = require('mongoose-float').loadType(mongoose, 2);

const foodItemSchema = new mongoose.Schema({
    foodName:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Float,
        required:true,
    },
})

module.exports = mongoose.model("FoodItem",foodItemSchema);