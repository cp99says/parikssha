const mongoose = require("mongoose");
const schema = mongoose.Schema({
  username: {
    unique: true,
    required: true,

    type: String,
  },
  email: {
    unique: true,
    required: true,
    type: String,
  },
  teacher_id: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("Teacher Data", schema);
