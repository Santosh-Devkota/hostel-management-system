const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
   title:{
       type:String,
       required:true
   },
   contentId:{
       type:String,
       required:true
   },
   date:{
       type:Date,
       default:Date.now
   },
   notificationOf:{
        type:String,
        enum:["notice","query"],
        default:"notice"
   }
})

module.exports = mongoose.model("Notification",notificationSchema);