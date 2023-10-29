const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");

//@desc Get all bootcamps
//@route  GET /api/v1/courses
//@route  GET /api/v1/bootcamps/:bootcampId/courses
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  const courses = await query;
  if (!courses) {
    return next(
      new ErrorResponse(
        `courses not found for bootcamp with id of ${req.params.bootcampId}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, count: courses.length, data: courses });
});
