const express = require("express");
const dotenv = require("dotenv");
// route files

const bootcamps = require("./routes/bootcamps");

// load dot env vars

dotenv.config({ path: "./config/config.env" });
const app = express();
const logger = require("./middleware/logger");
app.use(logger);
app.use("/api/v1/bootcamps", bootcamps);
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server running  in ${process.env.MODE_ENV} MODE IN PORT ${process.env.PORT}`
  )
);
