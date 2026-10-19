import { useEffect, useState } from 'react';
import type { ProductCardComponent } from './federation';
import type { RenderInfo } from './render-info';

export function App({
  info,
  ProductCard,
}: {
  info: RenderInfo;
  ProductCard: ProductCardComponent | null;
}) {
  const [hydrated, setHydrated] = useState(false);

  // Effects never run on the server, so this flips only once React owns the page.
  useEffect(() => setHydrated(true), []);

  return (
    <main>
      <h1>Zephyr SSR Runtime Remotes</h1>
      <p>
        The product card is a federated remote. This server loaded it from Zephyr,
        rendered it, and told your browser which build to hydrate.
      </p>

      <dl>
        <dt>Rendered by</dt>
        <dd>{info.runtime}</dd>
        <dt>Cohort</dt>
        <dd>{info.cohort ?? 'n/a'}</dd>
        <dt>Release</dt>
        <dd>{info.release}</dd>
        <dt>Product card build</dt>
        <dd>{info.remoteOrigin ?? 'unavailable'}</dd>
        <dt>Hydrated</dt>
        <dd>{hydrated ? 'yes' : 'not yet'}</dd>
      </dl>

      {ProductCard ? (
        <ProductCard name="Trail running shoe" price="$129" />
      ) : (
        <p>The product card is unavailable right now.</p>
      )}
    </main>
  );
}
