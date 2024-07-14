import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

const App = () => (
  <div className="container">
    <div>Name: create-mf-app with zephyr</div>
    <div>Framework: react</div>
    <div>Language: TypeScript</div>
    <div>CSS: Empty CSS</div>
    <button>Maybe a button not working?</button>
  </div>
);
const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(<App />);
