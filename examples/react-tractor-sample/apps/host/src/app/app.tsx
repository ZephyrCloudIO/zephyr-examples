import * as ReactDOM from 'react-dom/client';
import { StrictMode, lazy, Suspense } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const TeamRedLayout = lazy(() => import('team-red/TeamRedLayout'));
export function App() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <TeamRedLayout id="app"></TeamRedLayout>
    </Suspense>
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

export default App;
