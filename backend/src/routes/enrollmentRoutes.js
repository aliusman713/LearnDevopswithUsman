const express = require("express");

const {
  enrollInCourse,
  getMyCourses,
  updateCourseProgress,
} = require("../controllers/enrollmentController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/courses/:id/enroll",
  authenticate,
  enrollInCourse
);

router.get(
  "/users/me/courses",
  authenticate,
  getMyCourses
);

router.put(
  "/courses/:id/progress",
  authenticate,
  updateCourseProgress
);

module.exports = router;
