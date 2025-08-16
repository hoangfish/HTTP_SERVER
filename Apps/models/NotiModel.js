const mongoose = require("mongoose");

const NotiSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("NotiModel", NotiSchema);
