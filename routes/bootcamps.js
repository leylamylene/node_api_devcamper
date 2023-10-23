const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
});
router.post("/", (req, res) => {
  res.status(201).json({ success: true, msg: "Bootcamp successfully created" });
});

router.put("/:id", (req, res) => {
  res.status(200).json({
    success: true,
    msg: `bootcamp updated successfully ${req.params.id}`,
  });
});

router.delete(":id", (req, res) => {
  res.status(200).json({ success: true, msg: "Bootcamp deleted successfully" });
});

module.exports = router;
