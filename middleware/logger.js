const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")} ${req.originalUrl}`
  );
  console.log("Middleware ran");
  next();
};

module.exports = logger;
