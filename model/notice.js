const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staffs",
    required: true,
  },
  noticeTitle:{
      type:String,
      required:true,
  },
  noticeContent:{
      type:String,
      required:true,
  },
  publishedDate:{
    type:Date,
    default:Date.now,
    // required:true
  }
});

module.exports = mongoose.model("Notice",noticeSchema);
