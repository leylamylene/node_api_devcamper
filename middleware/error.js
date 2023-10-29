const ErrorResponse = require("../utils/errorResponse");
const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red);
  const error = { ...err };
  error.message = err.message;
  if (err.name == "MongooseError") {
    const message = `Bootcamp not found with id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message });
};

module.exports = errorHandler;
