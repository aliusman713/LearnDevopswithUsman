import { useState } from "react";

import { updateCourseProgress } from "../services/api";
import { useAuth } from "../context/useAuth";

function CourseLearning({ course, onBack }) {
  const { token } = useAuth();

  const lessons = [
    "Introduction",
    "Core Concepts",
    "Hands-On Setup",
    "Real-World Project",
    "Best Practices",
  ];

  const [progress, setProgress] = useState(
    Number(course.progress) || 0
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const completedCount = Math.round(
    (progress / 100) * lessons.length
  );

  const completedLessons = lessons.slice(
    0,
    completedCount
  );

  const toggleLesson = async (lesson) => {
    if (!token || saving) {
      return;
    }

    const isCompleted =
      completedLessons.includes(lesson);

    let newCompletedLessons;

    if (isCompleted) {
      newCompletedLessons =
        completedLessons.filter(
          (item) => item !== lesson
        );
    } else {
      newCompletedLessons = [
        ...completedLessons,
        lesson,
      ];
    }

    const newProgress = Math.round(
      (newCompletedLessons.length /
        lessons.length) *
        100
    );

    console.log(
      "Sending progress:",
      newProgress
    );

    try {
      setSaving(true);
      setError("");

      await updateCourseProgress(
        course.id,
        newProgress,
        token
      );


      setProgress(newProgress);
    } catch (error) {
      console.error(
        "Progress update error:",
        error
      );

      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="learning-section">
      <div className="learning-container">

        <button
          className="course-link"
          onClick={onBack}
        >
          ← Back to My Courses
        </button>

        <div className="learning-header">
          <p className="section-label">
            COURSE LEARNING
          </p>

          <h1>{course.title}</h1>

          <p>{course.description}</p>

          <div className="course-meta">
            <span>{course.level}</span>

            <span>
              {course.duration_hours} hours
            </span>
          </div>
        </div>

        <div className="learning-progress">
          <div className="progress-header">
            <span>Your Progress</span>

            <strong>{progress}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <div className="lesson-list">
          <h2>Course Content</h2>

          {lessons.map((lesson, index) => {
            const completed =
              completedLessons.includes(lesson);

            return (
              <article
                key={lesson}
                className={`lesson-card ${
                  completed
                    ? "lesson-completed"
                    : ""
                }`}
              >
                <div className="lesson-number">
                  {completed
                    ? "✓"
                    : index + 1}
                </div>

                <div className="lesson-content">
                  <h3>{lesson}</h3>

                  <p>
                    Learn{" "}
                    {lesson.toLowerCase()} through
                    practical DevOps examples and
                    hands-on exercises.
                  </p>
                </div>

                <button
                  className="continue-button"
                  disabled={saving}
                  onClick={() =>
                    toggleLesson(lesson)
                  }
                >
                  {saving
                    ? "Saving..."
                    : completed
                    ? "Completed ✓"
                    : "Mark Complete"}
                </button>
              </article>
            );
          })}
        </div>

        {progress === 100 && (
          <div className="course-complete">
            <h2>
              🎉 Course Completed!
            </h2>

            <p>
              Congratulations! You have completed{" "}
              {course.title}.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

export default CourseLearning;
