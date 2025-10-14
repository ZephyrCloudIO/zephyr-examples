import React, { useEffect, useState } from 'react';

// Import the baseHref functionality
declare global {
  interface Window {
    __BASEHREF__: string;
  }
}

const App: React.FC = () => {
  const [detectedBase, setDetectedBase] = useState<string>('');
  const [manifestContent, setManifestContent] =
    useState<string>('Loading 9...');

  return (
    <div className="container">
      <h1>BaseHref Webpack Example</h1>

      <div className="card">
        <h2>Navigation</h2>
        <div className="row">
          <a href="./">Home</a>
          <a href="./about">About</a>
          <a href="./products">Products</a>
        </div>
      </div>

      <footer>
        <p>
          This example demonstrates the BaseHref functionality in a Webpack
          application.
        </p>
        <p>Try running with different public paths using:</p>
        <p className="resource-path">npm run start:base</p>
      </footer>
    </div>
  );
};

export default App;
