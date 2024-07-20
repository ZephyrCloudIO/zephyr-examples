import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

document.body.appendChild(
  Object.assign(document.createElement(`div`), { id: "root" })
);
createRoot(document.getElementById("root")!).render(<App />);
