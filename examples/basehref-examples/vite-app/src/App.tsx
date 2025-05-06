import { useEffect, useState } from 'react';
// import baseHref from 'virtual:base-href';

function App() {
  const [detectedBase, setDetectedBase] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');

  // Create image paths with different types
  const imagePaths = {
    relative: './assets/logo.png',
    absolute: '/assets/logo.png',
    // baseHref: new URL('assets/logo.png', baseHref.baseHref).href
  };

  useEffect(() => {
    // Detect base path at runtime
    setDetectedBase(document.baseURI || window.location.pathname);
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <div className="container">
      <h1>BaseHref Vite Example</h1>

      <div className="card">
        <h2>Configuration Info</h2>
        {/*<p><strong>Configured Base:</strong> <span className="resource-path">{baseHref.baseHref}</span></p>*/}
        <p>
          <strong>Detected Base:</strong>{' '}
          <span className="resource-path">{detectedBase}</span>
        </p>
        <p>
          <strong>Current URL:</strong>{' '}
          <span className="resource-path">{currentUrl}</span>
        </p>
      </div>

      <div className="card">
        <h2>Path Resolution Examples</h2>

        <div>
          <h3>Relative Path</h3>
          <p className="resource-path">{imagePaths.relative}</p>
          <p>
            Resolves to:{' '}
            <span className="resource-path">
              {new URL(imagePaths.relative, window.location.href).href}
            </span>
          </p>
        </div>

        <div>
          <h3>Absolute Path</h3>
          <p className="resource-path">{imagePaths.absolute}</p>
          <p>
            Resolves to:{' '}
            <span className="resource-path">
              {new URL(imagePaths.absolute, window.location.origin).href}
            </span>
          </p>
        </div>

        <div>
          <h3>BaseHref Path</h3>
          <p className="resource-path">
            new URL('assets/logo.png', baseHref.baseHref)
          </p>
          {/*<p>Resolves to: <span className="resource-path">{imagePaths.baseHref}</span></p>*/}
        </div>
      </div>

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
          This example demonstrates the BaseHref functionality in a Vite
          application.
        </p>
        <p>Try running with different base paths using:</p>
        <p className="resource-path">npm run dev:base</p>
      </footer>
    </div>
  );
}

export default App;
