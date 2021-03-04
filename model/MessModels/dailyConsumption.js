const mongoose = require("mongoose");
var Float = require('mongoose-float').loadType(mongoose, 2);


const dailyConsumptionSchema = new mongoose.Schema({
  studentId: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Student",
      required:true,
  },
  foodDetails:[{
      foodId:{
          type: mongoose.Schema.Types.ObjectId,
          ref:"FoodItem",
          required:true,
      },
      count:{
          type:Number,
          default:1
      },
      selected:{
        type:Boolean,
      }
  }],
    // totalAmount:{
    //     type:Float,
    //     required:true
    // },
    Date:{
        type:Date,
        default:Date.now,
        required:true,
    },
    partOfDay:{
        type:String,
        enum:['morning','evening']
    }
});

module.exports = mongoose.model("DailyConsumption",dailyConsumptionSchema);