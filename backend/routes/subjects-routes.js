const express = require("express");

const router = express.Router();

const { getLessons } = require("../controllers/lesson-controller");

router.get("/lessons/:id(\\d+)", getLessons);

module.exports = router;
