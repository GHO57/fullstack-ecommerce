const errorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsynErrors");

exports.checkToken = catchAsyncErrors(async (req, res, next) => {});
