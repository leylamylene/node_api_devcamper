//@desc Get all bootcamps
// @route  GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
};

//@desc Get a bootcamp
// @route  GET /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: "Show the bootcamp with the specified id " });
};

//@desc Create a new bootcamp
// @route  POST /api/v1/bootcamps/
//@access Private
exports.createBootcamp = (req, res, next) => {
  res.status(201).json({ success: true, msg: "Bootcamp successfully created" });
};

//@desc Update a bootcamp
// @route  PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `bootcamp updated successfully ${req.params.id}`,
  });
};

//@desc Delete a bootcamp
// @route  DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "Bootcamp deleted successfully" });
};
