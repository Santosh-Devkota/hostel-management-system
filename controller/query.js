const Query = require("../model/query");

//@route POST /studentquery/add
exports.addNewQuery = async(req,res)=>{
    try {
        const result = await Query.create(req.body);
        if(!result){
            return res.status(404).json({msg:"Couldn't add the query!"});
        }
        res.status(200).json({msg:"Query added successfully!",data:result});
    } catch (error) {
        console.log(error.message);
        res.status(404).json({msg:"Couldn't add the query"});
    }
}

//@route GET /studentquery/search/latest
exports.getLatestQuery = async (req, res, next) => {
    try {
      const result = await Query.find().sort({"_id":-1});
      if (result.length === 0) {
        return res.status(404).json({msg:"No Queries to show!"})
      }
      res.status(200).json({
        data: result,
      });
    } catch (error) {
      console.log(error.message)
      res.status(400).json({msg:"Couldn't show Queries!"})
    }
  };
  
//@route GET /studentquery/search?query.....
// resolveStatus = Pending/Resolved
exports.getQuery = async (req, res, next) => {
    try {
      const {resolveStatus} = req.query;
      var search = {};
      search.resolveStatus = resolveStatus;
      const result = await Query.find(search);
      if (result.length === 0) {
        return res.status(404).json({msg:"No Queries to show!"})
      }
      res.status(200).json({
        data: result,
      });
    } catch (error) {
      console.log(error.message)
      res.status(400).json({msg:"Couldn't show Queries!"})
    }
  };
  

  //@route PUT /studentquery/update/:id
  exports.updateQuery = async(req,res)=>{
    try {
      const result = await Query.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
      });
      if(!result){
        return res.status(404).json({msg:"Query with given id not found!"})
      }
      res.status(200).json({msg:"Update successful!",data:result});
    } catch (error) {
      console.log(error.message);
      return res.status(404).json({msg:"Couldn't update!"})
    }
  }
  //@route Delete /notice/delete/:id
  exports.deleteQuery = async(req,res)=>{
    try {
      const result = await Query.findByIdAndDelete(req.params.id);
      if(!result){
        return res.status(404).json({msg:"Query with given id not found!"})
      }
      res.status(200).json({msg:"Delete successful!"});
    } catch (error) {
      console.log(error.message);
      return res.status(404).json({msg:"Couldn't delete!"})
    }
  }
  