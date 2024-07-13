import './App.css';
import { lazy, Suspense } from 'react';
import { loadRemote } from '@module-federation/runtime';
//@ts-ignore
const Hello = lazy(() =>
  loadRemote('a2/Hello').then(module => ({ default: module.Hello })),
);
function App() {
  return (
    <div className="App max-w-[1200px] w-full flex items-center  h-[400px]">
      <div className="container mx-auto border w-full p-20 flex flex-col gap-10 rounded-lg border-white border-[0.2px]">
        <h1>Runhost :)</h1>
        <p>
          This is currently in the <code>runhost</code> app.{' '}
          <ul>
            <li>Directory name: runhost</li>
            <li>package.json name: @rspack-hmr/rspack-runhost</li>
          </ul>{' '}
          <br /> We are taking the <code>'Hello'</code>module from App_02
        </p>

        <Suspense fallback="Loading Hello">
          <Hello name={'bob?'} />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
