const express = require("express");
const dotenv = require("dotenv");

// load dot env vars

dotenv.config({ path: "./config/config.env" });
const app = express();
app.get("/api/v1/bootcamps", (req, res) => {
  res.status(200).json({ success: true, msg: "Show all bootcamps" });
});

app.post("/api/v1/bootcamps", (req, res) => {
  res.status(201).json({ success: true, msg: "Bootcamp successfully created" });
});

app.put("/api/v1/bootcamp/:id", (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      msg: `bootcamp updated successfully ${req.params.id}`,
    });
});

app.delete("/api/v1/bootcamp/:id", (req, res) => {
  res.status(200).json({ success: true, msg: "Bootcamp deleted successfully" });
});
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server running  in ${process.env.MODE_ENV} MODE IN PORT ${process.env.PORT}`
  )
);
