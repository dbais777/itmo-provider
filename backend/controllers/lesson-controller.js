const { Lesson } = require("../models/lesson");
ObjectId = require("mongodb").ObjectId;

const handleError = (res, error) => {
  res.status(500).json({ error });
};

const getLessons = async (req, res) => {
  try {
    const r = await Lesson.find({ groupId: req.params.id });
    res.status(200).json(r);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getLessons };
