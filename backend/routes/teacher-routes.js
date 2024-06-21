const express = require("express");

const router = express.Router();

const {
    getTeachers,
    getTeacher,
    sendComment,
    getAdmin,
    deleteReview,
    acceptReview
} = require("../controllers/teacher-controller");

router.get("/teachers", getTeachers);
router.get("/teacher", getTeacher);
router.post("/comment", sendComment);
router.post("/admin", getAdmin);
router.post("/delete", deleteReview);
router.post("/accept", acceptReview);

module.exports = router;
