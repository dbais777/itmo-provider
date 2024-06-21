const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema([{
  title: String,
  groups:Array,
}]);

const Group = mongoose.model("Group", groupSchema);

module.exports = { Group };
