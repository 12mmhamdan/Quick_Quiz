import React from "react";
import "./index.css"; // Separate CSS file for further styling

function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-heading">404</h1>
      <p className="notfound-text">Oops! Page not found.</p>
      <a href="/" className="notfound-link">Go back to Home</a>
    </div>
  );
}

export default NotFound;
