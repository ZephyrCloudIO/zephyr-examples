import React, { Suspense } from 'react';
const Button = React.lazy(() => import('remote/Button'));

const App = () => (
  <div>
    <h1>Welcome to the Host App</h1>
    <p>This is the host app, which is running React {React.version}.</p>

    <Suspense fallback="Loading Button from remote">
      <Button />
    </Suspense>
  </div>
);

export default App;
