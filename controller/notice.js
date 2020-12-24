const Notice = require("../model/notice");
const ErrorResponse = require("../utils/customError");

exports.getNotice = async (req, res, next) => {
  const result = await Notice.find();
  if (result.length === 0) {
    return next(new ErrorResponse("No notices to show", 404));
  }
  res.status(200).json({
    success: true,
    data: result,
  });
};

exports.postNotice = async (req, res, next) => {
  console.log(Date.now());
  try {
    const result = await Notice.create(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    next(new ErrorResponse(error.message, 400));
  }
};
