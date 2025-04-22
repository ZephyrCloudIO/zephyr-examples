import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import Recipe from "./Recipe";

const App = () => <Recipe />;

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);
root.render(<App />);
