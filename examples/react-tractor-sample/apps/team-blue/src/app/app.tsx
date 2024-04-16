// eslint-disable-next-line @typescript-eslint/no-unused-vars

import * as ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import BlueBasket from './team-blue-basket';
import BlueBuy from './team-blue-buy';

export function App() {
  return (
    <div>
      <BlueBasket id="basket"></BlueBasket>
      <BlueBuy id="buy" sku="t_fendt"></BlueBuy>
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
