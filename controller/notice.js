const Notice = require("../model/notice");

//@route GET /notice/search/latest
exports.getLatestNotice = async (req, res, next) => {
  try {
    const result = await Notice.find().sort({"_id":-1});
    if (result.length === 0) {
      return res.status(404).json({msg:"No notice(s) to show!"})
    }
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.log(error.message)
    res.status(400).json({msg:"Couldn't show notice(s)!"})
  }
};


//@route Post /notice/add
exports.postNotice = async (req, res, next) => {
  try {
    const result = await Notice.create(req.body);
    if(!result){
      return res.status(400).json({msg:"Couldn't add the notice!"})
    }
    res.status(200).json({
      msg:"Notice add succesfully!",
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({msg:"Couldn't add the notice!"});
  }
};

//@route PUT /notice/update/:id
exports.updateNotice = async(req,res)=>{
  try {
    const result = await Notice.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    });
    if(!result){
      return res.status(404).json({msg:"Notice with given id not found!"})
    }
    res.status(200).json({msg:"Update successful!",data:result});
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({msg:"Couldn't update!"})
  }
}
//@route Delte /notice/delete/:id
exports.deleteNotice = async(req,res)=>{
  try {
    const result = await Notice.findByIdAndDelete(req.params.id);
    if(!result){
      return res.status(404).json({msg:"Notice with given id not found!"})
    }
    res.status(200).json({msg:"Delete successful!"});
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({msg:"Couldn't delete!"})
  }
}
