import Button from './Button';
import React from 'react';

function App() {
  return (
    <React.Suspense fallback={null}>
        <Button>&#128133; Test Button</Button>
    </React.Suspense>
  );
}

export default App;
