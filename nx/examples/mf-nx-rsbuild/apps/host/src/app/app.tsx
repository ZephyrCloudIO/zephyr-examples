import * as React from 'react';
import NxWelcome from './nx-welcome';
import '../styles.css';

import { Route, Routes, Link } from 'react-router-dom';

const Remote1 = React.lazy(() => import('remote1/Module'));
const Remote2 = React.lazy(() => import('remote2/Module'));

export function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div>
        <NxWelcome title="@mf-nx-rsbuild/host" />

        {/* START: routes */}
        {/* These routes and navigation have been generated for you */}
        {/* Feel free to move and update them to fit your needs */}
        <br />
        <hr />
        <br />
        <div role="navigation">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/remote1">Remote 1</Link>
            </li>
            <li>
              <Link to="/remote2">Remote 2</Link>
            </li>
          </ul>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                This is the host application.{' '}
                <Link to="/remote1">Click here for Remote 1</Link> or{' '}
                <Link to="/remote2">Click here for Remote 2</Link>.
              </div>
            }
          />
          <Route path="/remote1" element={<Remote1 />} />
          <Route path="/remote2" element={<Remote2 />} />
        </Routes>
        {/* END: routes */}
      </div>
    </React.Suspense>
  );
}

export default App;
