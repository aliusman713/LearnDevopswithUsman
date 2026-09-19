import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          Learn<span>DevOps</span>withUsman
        </div>

        <nav>
          <a href="#courses">Courses</a>
          <a href="#about">About</a>
          <button className="login-button">Login</button>
          <button className="register-button">Register</button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="hero-label">LEARN • BUILD • DEPLOY</p>

            <h1>
              Master DevOps Through
              <span> Real-World Practice</span>
            </h1>

            <p className="hero-description">
              Learn AWS, Docker, Kubernetes, Terraform, CI/CD, GitOps and
              modern DevOps practices through practical hands-on learning.
            </p>

            <div className="hero-buttons">
              <button className="primary-button">Explore Courses</button>
              <button className="secondary-button">Start Learning</button>
            </div>
          </div>
        </section>

        <section id="courses" className="courses-section">
          <div className="section-heading">
            <p>WHAT YOU CAN LEARN</p>
            <h2>Explore DevOps Courses</h2>
            <span>
              Build practical skills across the complete DevOps lifecycle.
            </span>
          </div>

          <div className="course-grid">
            <CourseCard
              icon="☁️"
              title="AWS & Cloud"
              description="Learn AWS infrastructure, IAM, VPC, EC2, EKS and cloud architecture."
            />

            <CourseCard
              icon="🐳"
              title="Docker"
              description="Learn containers, images, networking, volumes and Docker Compose."
            />

            <CourseCard
              icon="☸️"
              title="Kubernetes"
              description="Master Pods, Deployments, Services, Ingress, ConfigMaps and more."
            />

            <CourseCard
              icon="🏗️"
              title="Terraform"
              description="Build cloud infrastructure using Infrastructure as Code."
            />

            <CourseCard
              icon="🔄"
              title="CI/CD"
              description="Build automated pipelines using GitHub Actions and modern CI/CD practices."
            />

            <CourseCard
              icon="🚀"
              title="GitOps & Argo CD"
              description="Learn GitOps principles and continuous delivery with Argo CD."
            />
          </div>
        </section>

        <section id="about" className="about-section">
          <div>
            <p className="section-label">ABOUT THE PLATFORM</p>
            <h2>Learn DevOps by Building.</h2>
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
        <p>© 2026 LearnDevopswithUsman. Learn. Build. Deploy.</p>
      </footer>
    </div>
  );
}

function CourseCard({ icon, title, description }) {
  return (
    <article className="course-card">
      <div className="course-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button>Explore →</button>
    </article>
  );
}

export default App;
