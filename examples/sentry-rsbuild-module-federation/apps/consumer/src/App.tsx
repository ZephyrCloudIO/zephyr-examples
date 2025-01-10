import "./App.css";
//@ts-expect-error - Its there in the remote entry
import RemoteEntry from "producer/Producer";

const App = () => {
  const handleClick = () => {
    throw new Error("This is your first error!");
  };
  return (
    <div className="content">
      <button type="button" onClick={handleClick}>
        Break Consumer
      </button>
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <div style={{ border: "1px solid white" }}>
        <RemoteEntry />
      </div>
    </div>
  );
};

export default App;
