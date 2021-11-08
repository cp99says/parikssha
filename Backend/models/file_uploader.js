const mongoose = require("mongoose");
const schema = mongoose.Schema({
  file_name: {
    required: true,
    type: String,
  },
  //   date_uploaded: {
  //     required: true,
  //     type: String,
  //   },
});

module.exports = mongoose.model("File Data", schema);
