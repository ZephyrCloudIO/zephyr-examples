import './App.css';
import { Hello } from './Hello';

function App() {
  return (
    <div className="App max-w-[1200px] w-full flex items-center  h-[400px]">
      <div className="container mx-auto border w-full p-20 flex flex-col gap-10 rounded-lg border-white border-[0.2px]">
        <h1>App_02 :)</h1>
        <p>
          This is currently in app2 <br /> while we are using the{' '}
          <code>'Hello'</code>module ourselves, we are also exposing it and
          providing it to other applications.
        </p>

        <Hello name="Frank!!!" />
      </div>
    </div>
  );
}

export default App;
