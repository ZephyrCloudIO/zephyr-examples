// eslint-disable-next-line @typescript-eslint/no-unused-vars

import * as ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import TeamRedLayout from './team-red-layout';

export function App() {
  return (
    <div>
      <TeamRedLayout id="app"></TeamRedLayout>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
