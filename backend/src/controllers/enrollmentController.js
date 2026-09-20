const pool = require("../config/database");

const enrollInCourse = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const userId = req.user.id;

    const courseResult = await pool.query(
      `
      SELECT id, title
      FROM courses
      WHERE id = $1
      `,
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const enrollmentResult = await pool.query(
      `
      SELECT id
      FROM enrollments
      WHERE user_id = $1
        AND course_id = $2
      `,
      [userId, courseId]
    );

    if (enrollmentResult.rows.length > 0) {
      return res.status(409).json({
        message: "You are already enrolled in this course",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO enrollments (
        user_id,
        course_id
      )
      VALUES ($1, $2)
      RETURNING
        id,
        user_id,
        course_id,
        enrolled_at,
        progress
      `,
      [userId, courseId]
    );

    res.status(201).json({
      message: "Successfully enrolled in course",
      enrollment: result.rows[0],
    });
  } catch (error) {
    console.error("Enrollment error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.title,
        c.description,
        c.category,
        c.level,
        c.duration_hours,
        e.enrolled_at,
        e.progress
      FROM enrollments e
      INNER JOIN courses c
        ON e.course_id = c.id
      WHERE e.user_id = $1
      ORDER BY e.enrolled_at DESC
      `,
      [userId]
    );

    res.json({
      count: result.rows.length,
      courses: result.rows,
    });
  } catch (error) {
    console.error(
      "Get my courses error:",
      error
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateCourseProgress = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const userId = req.user.id;

    /*
     * Safely read the request body.
     */
    const body = req.body || {};
    const progress = body.progress;

    console.log(
      "Progress update request:",
      {
        userId,
        courseId,
        progress,
      }
    );

    if (
      progress === undefined ||
      !Number.isInteger(progress) ||
      progress < 0 ||
      progress > 100
    ) {
      return res.status(400).json({
        message:
          "Progress must be an integer between 0 and 100",
      });
    }

    const result = await pool.query(
      `
      UPDATE enrollments
      SET progress = $1
      WHERE user_id = $2
        AND course_id = $3
      RETURNING
        id,
        user_id,
        course_id,
        progress
      `,
      [
        progress,
        userId,
        courseId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "You are not enrolled in this course",
      });
    }

    res.json({
      message:
        "Course progress updated",
      enrollment:
        result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update course progress error:",
      error
    );

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  enrollInCourse,
  getMyCourses,
  updateCourseProgress,
};
