const fs = require("fs");
const { fetchAllTimetables, fetchPage } = require("./services/parse-service");
const { getListTeachers } = require('./services/teachers')

const init = async () => {
  await getListTeachers()
  await fetchPage()
  fetchAllTimetables()
  setInterval(async () => {
    await fetchPage()
    fetchAllTimetables()
  }
  , 518400000)
}
init()

const groupRoutes = require("./routes/group-routes");
const subjectsRoutes = require("./routes/subjects-routes");
const teachersRoutes = require("./routes/teacher-routes");

const express = require("express");

const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
app.use(cors()).use(express.json()).use(groupRoutes).use(subjectsRoutes).use(teachersRoutes)
const URL = "mongodb://localhost:27017/timetable";

mongoose
  .connect(URL)
  .then(() => console.log("подключено успешно"))
  .catch((e) => console.log(e));
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

