import { useEffect, useState } from 'react';
import type { RenderInfo } from './render-info';

export function App({ info }: { info: RenderInfo | null }) {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Effects never run on the server, so this flips only once React owns the page.
  useEffect(() => setHydrated(true), []);

  return (
    <main>
      <h1>Zephyr SSR Release Pinning</h1>
      <p>
        Zephyr decides which client build is live. This server only renders it when
        it was built from that same build.
      </p>

      <dl>
        <dt>Rendered by</dt>
        <dd>{info ? info.runtime : 'Browser only (no server render)'}</dd>
        <dt>Release</dt>
        <dd>{info ? info.release : 'n/a'}</dd>
        <dt>Assets served from</dt>
        <dd>{info ? info.zephyrOrigin : 'This origin'}</dd>
        <dt>Rendered at</dt>
        <dd>{info ? info.renderedAt : 'n/a'}</dd>
        <dt>Hydrated</dt>
        <dd>{hydrated ? 'yes' : 'not yet'}</dd>
      </dl>

      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Clicked {count} times
      </button>
    </main>
  );
}
