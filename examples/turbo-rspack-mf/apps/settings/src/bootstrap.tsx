import React from 'react';
import ReactDOM from 'react-dom/client';
import Host from 'host/RemoteEntry';
import './bootstrap.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Host />
  </React.StrictMode>,
);
