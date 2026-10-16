import { useEffect, useState } from 'react';
import type { RenderInfo } from './render-info';

export function App({ info }: { info: RenderInfo | null }) {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Effects never run on the server, so this flips only once React owns the page.
  useEffect(() => setHydrated(true), []);

  return (
    <main>
      <h1>Zephyr SSR Snapshot Assets</h1>
      <p>
        Your server streams the whole document. It learns which hashed files to load by
        asking the Zephyr edge about the live snapshot.
      </p>

      <dl>
        <dt>Rendered by</dt>
        <dd>{info ? info.runtime : 'Browser only (no server render)'}</dd>
        <dt>Snapshot</dt>
        <dd>{info ? info.snapshotId : 'n/a'}</dd>
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
