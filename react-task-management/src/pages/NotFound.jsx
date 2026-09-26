import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <p className="not-found-code">404</p>

        <h1>Page Not Found</h1>

        <p className="not-found-message">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </main>
  );
}

export default NotFound;