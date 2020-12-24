const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName:{
    type:String,
    required:true,
  },
  student: [{
    type: String,
    ref: "Student",
    //required: true,
  }],
  assets: {
    table: { type: Number, default: 0 },
    chair: { type: Number, default: 0 },
    bed: { type: Number, default: 0 },
    wadrobe: { type: Number, default: 0 },
  },
  block: { type: String, enum: ["A", "B", "C","D", "E"] },
});

module.exports = mongoose.model("Room", roomSchema);
