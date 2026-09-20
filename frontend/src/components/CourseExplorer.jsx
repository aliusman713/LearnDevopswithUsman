import { useEffect, useState } from "react";
import { getCourses } from "../services/api";

const CourseExplorer = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data.courses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>Unable to load courses: {error}</p>;
  }

  return (
    <section className="course-explorer">
      <h2>Explore DevOps Courses</h2>

      <div className="course-grid">
        {courses.map((course) => (
          <article className="course-card" key={course.id}>
            <span>{course.category}</span>

            <h3>{course.title}</h3>

            <p>{course.description}</p>

            <div>
              <strong>{course.level}</strong>
              <span> · {course.duration_hours} hours</span>
            </div>

            <button>View Course</button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CourseExplorer;
