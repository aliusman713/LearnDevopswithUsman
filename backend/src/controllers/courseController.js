const pool = require("../config/database");

const getCourses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        description,
        category,
        level,
        duration_hours,
        created_at
      FROM courses
      ORDER BY created_at DESC
    `);

    res.json({
      count: result.rows.length,
      courses: result.rows,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        title,
        description,
        category,
        level,
        duration_hours,
        created_at
      FROM courses
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json({
      course: result.rows[0],
    });
  } catch (error) {
    console.error("Get course error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
};
