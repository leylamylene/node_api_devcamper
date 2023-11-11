const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const BootCamp = require("../models/Bootcamp");

const advancedResults = require("../middleware/advancedResults");

// Iknclude other resource router
const courseRouter = require("./courses");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");
router.use("/:bootcampId/courses", courseRouter);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(BootCamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;
