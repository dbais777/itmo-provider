const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  //_id: mongoose.ObjectId,
  groupId: String,
  days: Array,
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = { Lesson };
