const mongoose = require("mongoose");
const Bootcamp = require("./Bootcamp");
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "plase add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "please add number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skills"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scolarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

//static method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  console.log(`calculating average tuition ${obj[0].averageCost}`.bgMagenta);
  await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
    averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
  });
};
// Call getAverageCost before remove
CourseSchema.pre("deleteOne", function () {
  this.constructor.getAverageCost(this.bootcamp);
});
// Call getAverageCost after save
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
