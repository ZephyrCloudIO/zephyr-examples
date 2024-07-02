import './App.css';
import { Hello } from 'app_02/Hello';

function App() {
  return (
    <div className="App max-w-[1200px] w-full flex items-center  h-[400px]">
      <div className="container mx-auto border w-full p-20 flex flex-col gap-10 rounded-lg border-white border-[0.2px]">
        <h1>App_01 :)</h1>
        <p>
          This is currently in App_01.{' '}
          <ul>
            <li>Directory name: host</li>
            <li>package.json name: @rspack-hmr/rspack-host</li>
          </ul>{' '}
          <br /> We are taking the <code>'Hello'</code>module from App_02
        </p>
        <div className="logo">
          <img
            className="w-10 just"
            src="https://cdn.builder.io/api/v1/image/assets%2Fea8c8e416fd64171bc2ef9ac5ac226e6%2Fa079d11fa8c944439878233232acc4b5"
          ></img>
        </div>

        <Hello name={'bobzz'} />
      </div>
    </div>
  );
}

export default App;
