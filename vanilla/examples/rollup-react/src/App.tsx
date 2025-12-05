import { useState } from "react";
import ReactLogo from "./assets/react.svg";
import RollupLogo from "./assets/rollup.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://rollupjs.org/" target="_blank">
          <RollupLogo className="logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <ReactLogo className="logo react" />
        </a>
      </div>
      <h1>Rollup + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Rollup and React logos to learn more
      </p>
    </>
  );
}

export default App;
