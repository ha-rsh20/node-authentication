const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/auth")
    .then(() => {
      console.log("DB connected!");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { connect };
