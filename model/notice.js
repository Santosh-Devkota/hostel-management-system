const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  // _id: { type: String, default: Date.now },
  user: {
    type: String, //here the type represents the type of _id, if it was default we should use mongoose.schema.type.ObjectId
    ref: "Student",
    required: true,
  },
  noticeTitle:{
      type:String,
      required:true,

  },
  noticeContent:{
      type:String,
      required:true,
  }
});

module.exports = mongoose.model("Notice",noticeSchema);
