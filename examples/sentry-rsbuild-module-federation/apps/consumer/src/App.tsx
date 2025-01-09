import "./App.css";
//@ts-expect-error - Its there in the remote entry
import RemoteEntry from "producer/Producer";

const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <div style={{ border: "1px solid white" }}>
        <RemoteEntry />
      </div>
    </div>
  );
};

export default App;
