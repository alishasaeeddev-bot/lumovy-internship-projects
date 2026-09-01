import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <main className="home-page">

      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">TASK MANAGEMENT</p>
          <h1>Organize your work. Get things done.</h1>
          <p>
            Create, manage, and track your tasks in one simple
            and organized workspace.
          </p>
          <Link to="/tasks" className="hero-button"> Go to My Tasks</Link>
        </div>
      </section>

      <section className="features-section">
        <h2>Everything you need to manage tasks</h2>
        <div className="features-grid">

          <article className="feature-card">
            <h3>Create Tasks</h3>
            <p>
              Quickly create tasks with categories, priorities,
              and due dates.
            </p>
          </article>

          <article className="feature-card">
            <h3>Track Progress</h3>
            <p>
              Mark tasks as completed and keep track of your
              remaining work.
            </p>
          </article>

          <article className="feature-card">
            <h3>Stay Organized</h3>
            <p>
              Filter your tasks and focus on what needs to
              be completed next.
            </p>
          </article>

        </div>
      </section>

      <section className="home-cta">
        <h2>Ready to organize your tasks?</h2>
        <Link to="/tasks" className="hero-button">Manage Tasks</Link>
      </section>

    </main>
  );
}

export default Home;