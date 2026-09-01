import './About.css';

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="about-label">ABOUT THE APP</p>
        <h1>Simple task management for everyday productivity.</h1>
        <p>
          My Task Manager is a simple React application designed to help
          users create, organize, and track their daily tasks.
        </p>
      </section>

      <section className="about-content">
        <div className="about-card">
          <h2>What you can do</h2>
          <p>
            Create tasks, set categories and priorities, add due dates,
            and keep track of completed and pending tasks.
          </p>
        </div>

        <div className="about-card">
          <h2>Built with React</h2>
          <p>
            This application was built using React components, hooks,
            state management, local storage, and React Router.
          </p>
        </div>

        <div className="about-card">
          <h2>Stay organized</h2>
          <p>
            Use task filters to quickly view all, pending, or completed
            tasks and keep your work organized.
          </p>
        </div>
      </section>
    </main>
  );
}

export default About;