import React from 'react';
import ReactDOM from 'react-dom/client';
import RemoteEntry from './RemoteEntry.tsx';
import './bootstrap.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RemoteEntry />
  </React.StrictMode>,
);
