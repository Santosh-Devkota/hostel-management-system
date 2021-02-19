const mongoose = require("mongoose");

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
      }
  }],
    paymentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Payment",
    },
    Date:{
        type:Date,
        required:true,
    },
    partOfDay:{
        type:String,
        enum:['morning','evening']
    }
});

module.exports = mongoose.model("DailyConsumption",dailyConsumptionSchema);