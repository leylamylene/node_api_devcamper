const geocoder = require("../utils/geocoder");
const BootCamp = require("../models/Bootcamp");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require("path");

//@desc Get all bootcamps
//@route  GET /api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc Get a bootcamp
//@route Get /api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc Create a new bootcamp
//@route  POST /api/v1/bootcamps/
//@access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  //Check fOr published bootcamp
  const publishedBootcamp = await BootCamp.findOne({ user: req.user.id });
  // If the user is not the admin , they can only add one bootcamp
  if (req.user.role != "admin" && publishedBootcamp) {
    return next(
      new ErrorResponse(`You can't create more than one bootcamp`, 400)
    );
  }
  const bootcamp = await BootCamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc Update a bootcamp
// @route  PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await BootCamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse("No bootcamp found with the this id", 404));
  }

  //Make sure the user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        "Only the bootcamp owner or the admin can update the bootcamp",
        401
      )
    );
  }

  bootcamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc Delete a bootcamp
//@route  DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`)
    );
  }

  //Make sure the user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        "Only the bootcamp owner or the admin can delete this bootcamp",
        401
      )
    );
  }
  bootcamp.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

//@desc upload photo a bootcamp
//@route  PUT /api/v1/bootcamps/:id
//@access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootCamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`)
    );
  }

  //Make sure the user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        "Only the bootcamp owner or the admin can upload this bootcamp",
        401
      )
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  // Make sure that the file is a photo
  if (!file.mimetype.startsWith("image/")) {
    return next(new ErrorResponse(`File should be an image`, 400));
  }

  //Check file size

  if (!file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Size should be les than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //Create custom filename
  file.name = `photo_${bootcamp._id}_${Date.now()}${path.parse(file.name).ext}`;
  console.log(`file name ${file.name}`);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
  });

  await BootCamp.findByIdAndUpdate(req.params.id, { photo: file.name });
  res.status(200).json({ success: true, data: file.name });
});
//@desc Get bootcamps within a raidus
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  //Get a lat lng from geocoder
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  //divide distance by radius of earth
  //earth radius 3963  miles
  const radius = distance / 3963;
  const bootcamps = await BootCamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
