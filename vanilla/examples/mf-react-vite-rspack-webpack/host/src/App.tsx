// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import { lazy } from 'react';

import { Suspense } from 'react';
import './App.css';
//@ts-expect-error - Remote
const RemoteButton = lazy(() => import('vite_remote/Button'));
//@ts-expect-error - Remote
const WebpackImage = lazy(() => import('vite_webpack/Image'));
//@ts-expect-error - Remote
const RspackImage = lazy(() => import('vite_rspack/Image'));

function App() {
  return (
    <>
      <Suspense fallback="Loading Button">
        <RemoteButton />
      </Suspense>
      <Suspense fallback="Loading Image">
        <WebpackImage />
      </Suspense>
      <Suspense fallback="Loading Image">
        <RspackImage />
      </Suspense>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
