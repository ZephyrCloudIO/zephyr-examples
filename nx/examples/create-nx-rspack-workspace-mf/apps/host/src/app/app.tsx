import * as React from 'react';

import NxWelcome from './nx-welcome';

import { Link, Route, Routes } from 'react-router-dom';

const Remote1 = React.lazy(() => import('rspack_remote1/Module'));

const Remote2 = React.lazy(() => import('rspack_remote2/Module'));

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/rspack_remote1">Remote1</Link>
        </li>

        <li>
          <Link to="/rspack_remote2">Remote2</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="host" />} />

        <Route path="/rspack_remote1" element={<Remote1 />} />

        <Route path="/rspack_remote2" element={<Remote2 />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
