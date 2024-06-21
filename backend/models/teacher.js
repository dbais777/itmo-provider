const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  teacher: Object
  
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = { Teacher };
