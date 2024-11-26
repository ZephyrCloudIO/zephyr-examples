import RemoteSettings from 'settings/RemoteEntry';
import RemoteHome from 'home/RemoteEntry';

function App() {
  return (
    <div>
      <h1 className="text-3xl">Host</h1>
      <p>Host app</p>
      <div className="border border-red-500">
        <h1 className="text-5xl">Settings Remote App</h1>
        <RemoteSettings />
      </div>
      <div className="border border-blue-500">
        <h1 className="text-5xl">Home Remote App</h1>
        <RemoteHome />
      </div>
    </div>
  );
}

export default App;
