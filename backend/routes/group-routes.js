const express = require("express");

const router = express.Router();

const {
  getFillials,
  getGroupsType,
  getGroupsCourses,
  getGroups,
} = require("../controllers/group-controller");

router.get("/fillials", getFillials);

router.post("/groups-type", getGroupsType);

router.post("/groups-courses", getGroupsCourses);

router.post("/groups", getGroups);

module.exports = router;
