import { useEffect, useState } from "react";
import "./App.css";

import { getCourses, enrollInCourse } from "./services/api";
import { useAuth } from "./context/useAuth";

import Login from "./components/Login";
import Register from "./components/Register";
import MyCourses from "./components/MyCourses";

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

function App() {
  const { user, token, logout } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseError, setCourseError] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const [enrollmentMessage, setEnrollmentMessage] = useState("");

  const [myCoursesRefresh, setMyCoursesRefresh] = useState(0);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();

        setCourses(data.courses || []);
      } catch (error) {
        console.error("Course loading error:", error);
        setCourseError(error.message);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  const handleLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleEnroll = async (courseId) => {
    setEnrollmentMessage("");

    if (!user || !token) {
      setShowLogin(true);
      return;
    }

    try {
      setEnrollingCourse(courseId);

      const data = await enrollInCourse(courseId, token);

      setEnrollmentMessage(data.message);

      setMyCoursesRefresh((value) => value + 1);
    } catch (error) {
      setEnrollmentMessage(error.message);
    } finally {
      setEnrollingCourse(null);
    }
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          Learn<span>DevOps</span>withUsman
        </div>

        <nav>
          <a href="#courses">Courses</a>

          <a href="#about">About</a>

          {user ? (
            <>
              <a href="#my-courses">My Courses</a>

              <span className="welcome-user">
                Hi, {user.name}
              </span>

              <button
                className="login-button"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="login-button"
                onClick={handleLogin}
              >
                Login
              </button>

              <button
                className="register-button"
                onClick={handleRegister}
              >
                Register
              </button>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="hero-label">
              LEARN • BUILD • DEPLOY
            </p>

            <h1>
              Master DevOps Through
              <span> Real-World Practice</span>
            </h1>

            <p className="hero-description">
              Learn AWS, Docker, Kubernetes, Terraform, CI/CD, GitOps and
              modern DevOps practices through practical hands-on learning.
            </p>

            <div className="hero-buttons">
              <a
                href="#courses"
                className="primary-button"
              >
                Explore Courses
              </a>

              <a
                href="#courses"
                className="secondary-button"
              >
                Start Learning
              </a>
            </div>
          </div>
        </section>

        <section
          id="courses"
          className="courses-section"
        >
          <div className="section-heading">
            <p>WHAT YOU CAN LEARN</p>

            <h2>Explore DevOps Courses</h2>

            <span>
              Build practical skills across the complete DevOps lifecycle.
            </span>
          </div>

          {loadingCourses && (
            <div className="course-grid">
              <div className="course-card">
                <div className="course-icon">
                  ⏳
                </div>

                <h3>Loading Courses...</h3>

                <p>
                  Fetching courses from the platform.
                </p>
              </div>
            </div>
          )}

          {courseError && (
            <div className="course-grid">
              <div className="course-card">
                <div className="course-icon">
                  ⚠️
                </div>

                <h3>Unable to Load Courses</h3>

                <p>{courseError}</p>
              </div>
            </div>
          )}

          {!loadingCourses &&
            !courseError &&
            courses.length > 0 && (
              <div className="course-grid">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    icon={
                      courseIcons[course.category] || "📚"
                    }
                    title={course.title}
                    description={course.description}
                    level={course.level}
                    duration={course.duration_hours}
                    onEnroll={() =>
                      handleEnroll(course.id)
                    }
                    enrolling={
                      enrollingCourse === course.id
                    }
                  />
                ))}
              </div>
            )}
        </section>

        {enrollmentMessage && (
          <div className="enrollment-message">
            {enrollmentMessage}
          </div>
        )}

        {user && (
          <MyCourses
            refreshTrigger={myCoursesRefresh}
          />
        )}

        <section
          id="about"
          className="about-section"
        >
          <div>
            <p className="section-label">
              ABOUT THE PLATFORM
            </p>

            <h2>
              Learn DevOps by Building.
            </h2>

            <p>
              LearnDevopswithUsman is designed around practical learning.
              Instead of only watching tutorials, you will build applications,
              automate infrastructure and deploy real workloads.
            </p>
          </div>

          <div className="stats">
            <div>
              <strong>10+</strong>
              <span>DevOps Topics</span>
            </div>

            <div>
              <strong>Hands-On</strong>
              <span>Learning Approach</span>
            </div>

            <div>
              <strong>Cloud</strong>
              <span>Focused Projects</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>
          © 2026 LearnDevopswithUsman. Learn. Build. Deploy.
        </p>
      </footer>

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onRegister={handleRegister}
        />
      )}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

function CourseCard({
  icon,
  title,
  description,
  level,
  duration,
  onEnroll,
  enrolling,
}) {
  return (
    <article className="course-card">
      <div className="course-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="course-meta">
        <span>{level}</span>

        {duration && (
          <span>{duration} hours</span>
        )}
      </div>

      <button
        onClick={onEnroll}
        disabled={enrolling}
      >
        {enrolling ? "Enrolling..." : "Enroll →"}
      </button>
    </article>
  );
}

export default App;
