const { Group } = require("../models/group");
ObjectId = require("mongodb").ObjectId;

const handleError = (res, error) => {
  res.status(500).json({ error });
};

const getFillials = async (req, res) => {
  try {
    const r = await Group.find();
    res.status(200).json(r);
  } catch (error) {
    handleError(res, error);
  }
};

const getGroupsType = async (req, res) => {
  try {
    const r = await Group.distinct("groups.type", { _id: req.body.id });
    res.status(200).json(r);
  } catch (error) {
    handleError(res, error);
  }
};

const getGroupsCourses = async (req, res) => {
  try {
    const r = await Group.aggregate([
      {
        $unwind: "$groups",
      },
      {
        $match: {
          "groups.type": req.body.type,
          _id: ObjectId(req.body.id),
        },
      },
      {
        $group: {
          _id: "$_id",
          courses: {
            $addToSet: "$groups.course",
          },
        },
      },
    ]);
    res.status(200).json(r);
  } catch (error) {
    handleError(res, error);
  }
};

const getGroups = async (req, res) => {
  try {
    const r = await Group.aggregate([
      {
        $unwind: "$groups",
      },
      {
        $match: {
          "groups.type": req.body.type,
          "groups.course": req.body.course,
          _id: ObjectId(req.body.id),
        },
      },
      {
        $project: {
          _id: 0,
          groupId: "$groups.groupId",
          groupTitle: "$groups.groupTitle",
          link: "$groups.link",
        },
      },
    ]);
    res.status(200).json(r);
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = { getFillials, getGroupsType, getGroupsCourses, getGroups };
