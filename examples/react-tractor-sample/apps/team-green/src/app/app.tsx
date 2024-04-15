// eslint-disable-next-line @typescript-eslint/no-unused-vars

import GreenRecos from './team-green-recos';
import * as ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';

export function App() {
  return (
    <div>
      <GreenRecos id="reco" sku="t_porsche"></GreenRecos>
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
