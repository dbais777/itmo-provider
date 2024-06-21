const { Teacher } = require("../models/teacher");
const { v4: uuidv4 } = require('uuid');

globalToken = 'T#cVKpUk%G#m4l2Drw?K'

ObjectId = require("mongodb").ObjectId;

const handleError = (res, error) => {
  res.status(500).json({ error });
};

const getTeachers = async (req, res) => {
  try {
    const r = await Teacher.find({}, { 'teacher.name': 1, 'teacher.id': 1, _id: 0 });
    res.status(200).json(r);
  } catch (error) {
    handleError(res, error);
  }
};



const getAdmin = async (req, res) => {
  if (req.body?.token !== globalToken) {
    res.status(400).json('hui');
    return
  }
  try {
    const r = await Teacher.aggregate([
      { $match: { "teacher.reviews": { $elemMatch: { isValid: false } } } },
      { $match: { "teacher.reviews": { $exists: true } } },
      { $unwind: "$teacher.reviews" },
      { $project: { review: "$teacher.reviews", id: "$teacher.id" } }
    ])

    const notValidated = r.filter(el => !el.review.isValid)

    res.status(200).json(notValidated);
  } catch (error) {
    handleError(res, error);
  }
};

const deleteReview = async (req, res) => {
  try {

    if (req.body.data?.token !== globalToken) {
      res.status(400).json('hui');
      return
    }


    const { teacherid, revId, token } = req.body.data
    const r = await Teacher.findOne({ "teacher.id": teacherid })
    r.teacher.reviews = r.teacher.reviews.filter(el => el.id !== revId)

    await Teacher.updateOne({ "teacher.id": teacherid }, { $set: r })
    res.status(200).json('done');

  } catch (error) {
    console.log(error)
  }
}

const acceptReview = async (req, res) => {

  if (req.body.data?.token !== globalToken) {
    res.status(400).json('hui');
    return
  }
  try {

    const { teacherid, revId } = req.body.data
    const r = await Teacher.findOne({ "teacher.id": teacherid })


    r.teacher.reviews.find(el => el.id === revId).isValid = true

    await Teacher.updateOne({ "teacher.id": teacherid }, { $set: r })
    res.status(200).json('done');



  } catch (error) {
    handleError(res, error);
  }

}

const getTeacher = async (req, res) => {
  try {

    const r = await Teacher.findOne({ "teacher.id": req.query.id })
    if (!r.teacher?.reviews) r.teacher.reviews = []

    if (r.teacher?.reviews) {
      r.teacher.reviews = r.teacher?.reviews.filter(el => el.isValid)
    }

    res.status(200).json(r);
  } catch (error) {
    handleError(res, error);
  }
};

const sendComment = async (req, res) => {
  try {

    const r = await Teacher.findOne({ "teacher.id": req.body.revId })

    const review = {
      text: req.body.text ?? '',
      star: req.body.star ?? null,
      name: req.body.name ?? '',
      revId: req.body.revId ?? '',



      ...{ id: uuidv4(), date: new Date(), isValid: false, },
    }

    if (typeof review.text !== 'string' || review.text.length > 601) {
      res.status(400).json('hui');
      return
    }
    if (typeof review.star !== "number" || ![1, 2, 3, 4, 5].includes(review.star)) {
      res.status(400).json('hui');
      return
    }
    if (typeof review.name !== "string" || review.name.length > 25) {
      res.status(400).json('hui');
      return
    }
    if (typeof review.id !== "string" || review.id.length > 45) {
      res.status(400).json('hui');
      return
    }

    if (!r?.teacher) {
      res.status(400).json('hui');
      return
    }


    // если у товара еще нет поля "отзывы", создайте его
    if (!r.teacher?.reviews) {
      r.teacher.reviews = [];


    }

    // добавьте новый отзыв в массив "отзывы"
    r.teacher.reviews.push(review)


    console.log(review)
    await Teacher.updateOne({ "teacher.id": req.body.revId }, { $set: r });

    res.status(200).json({ done: true });

  } catch (error) {
    console.log(error)
  }


}

module.exports = { getTeachers, getTeacher, sendComment, getAdmin, deleteReview, acceptReview };
