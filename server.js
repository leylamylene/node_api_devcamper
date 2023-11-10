const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/error");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
dotenv.config({ path: "./config/config.env" });

// route files

const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
// load dot env vars

connectDb();
const app = express();
// body parser
app.use(express.json());
app.use(cookieParser());

// Dev logging middleware
if (process.env.MODE_ENV == "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server running  in ${process.env.MODE_ENV} MODE IN PORT ${process.env.PORT}`
  )
);
