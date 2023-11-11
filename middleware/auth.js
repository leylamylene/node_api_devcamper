const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route"));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);

  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorResponse("Not authorized to access this route"));
  }
  next();

  // else if(req.cookies.token) {
  //   token = req.cookies.token
  // }
});
