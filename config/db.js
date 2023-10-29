const mongoose = require("mongoose");
const connectDb = async () => {
  console.log(`mongo urin ${typeof process.env.MONGO_URI}`.yellow);
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,

    useUnifiedTopology: false,
  });

  console.log(`Mongo DB connected ${conn.connection.host}`.cyan);
};

module.exports = connectDb;
