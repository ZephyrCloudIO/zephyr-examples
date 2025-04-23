import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import Recipe from "remote/recipe";

const App = () => (
  <div className="container">
    <header className="header">
      <div className="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth="1.5"
            d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v10H4V12z"
          />
        </svg>
      </div>
      <h1>Recipe Book</h1>
      <p>Powered by React + Rspack2</p>
    </header>

    <React.Suspense
      fallback={<div className="card">Loading remote recipe...</div>}
    >
      <Recipe />
    </React.Suspense>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<App />);
