import { useEffect, useState } from "react";

import { getMyCourses } from "../services/api";
import { useAuth } from "../context/useAuth";
import CourseLearning from "./CourseLearning";

const courseIcons = {
  AWS: "☁️",
  Docker: "🐳",
  Kubernetes: "☸️",
  Terraform: "🏗️",
  "CI/CD": "🔄",
  GitOps: "🚀",
  DevSecOps: "🔐",
  "Cloud Migration": "☁️",
};

function MyCourses({ refreshTrigger }) {
  const { token } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const loadMyCourses = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getMyCourses(token);

        setCourses(data.courses || []);
      } catch (error) {
        console.error("My courses error:", error);

        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMyCourses();
  }, [token, refreshTrigger]);

  /*
   * If the user selected a course,
   * show the learning page.
   */
  if (selectedCourse) {
    return (
      <CourseLearning
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
      />
    );
  }

  if (loading) {
    return (
      <section
        id="my-courses"
        className="courses-section"
      >
        <div className="section-heading">
          <p>YOUR LEARNING</p>

          <h2>My Courses</h2>

          <span>
            Loading your enrolled courses...
          </span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="my-courses"
        className="courses-section"
      >
        <div className="section-heading">
          <p>YOUR LEARNING</p>

          <h2>My Courses</h2>

          <span>{error}</span>
        </div>
      </section>
    );
  }

  return (
    <section
      id="my-courses"
      className="courses-section"
    >
      <div className="section-heading">
        <p>YOUR LEARNING</p>

        <h2>My Courses</h2>

        <span>
          Continue your hands-on DevOps learning journey.
        </span>
      </div>

      {courses.length === 0 ? (
        <div className="course-grid">
          <div className="course-card">
            <div className="course-icon">
              📚
            </div>

            <h3>No Courses Yet</h3>

            <p>
              You haven't enrolled in any courses yet.
              Explore our courses and start learning.
            </p>

            <a
              href="#courses"
              className="course-link"
            >
              Explore Courses →
            </a>
          </div>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <article
              key={course.id}
              className="course-card"
            >
              <div className="course-icon">
                {courseIcons[course.category] || "📚"}
              </div>

              <h3>{course.title}</h3>

              <p>{course.description}</p>

              <div className="course-meta">
                <span>{course.level}</span>

                <span>
                  {course.duration_hours} hours
                </span>
              </div>

              <div className="progress-container">
                <div className="progress-header">
                  <span>Progress</span>

                  <strong>
                    {course.progress}%
                  </strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${course.progress}%`,
                    }}
                  />
                </div>
              </div>

              <button
                className="continue-button"
                onClick={() =>
                  setSelectedCourse(course)
                }
              >
                Continue Learning →
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyCourses;
