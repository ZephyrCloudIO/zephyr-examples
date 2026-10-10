import {
  createRootRoute,
  createRoute,
  createRouter,
  type ErrorComponentProps,
  lazyRouteComponent,
  Link,
  Outlet,
} from '@tanstack/react-router';

// Remote modules are only fetched when their route first renders
const ProductList = lazyRouteComponent(() => import('catalog/ProductList'));
const ProductDetail = lazyRouteComponent(() => import('catalog/ProductDetail'));

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <p>Nothing lives at this URL.</p>,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductList,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductPage,
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, productsRoute, productRoute]),
  defaultPreload: 'intent',
  defaultPendingComponent: () => <p>Loading remote…</p>,
  defaultErrorComponent: RemoteError,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function RootLayout() {
  return (
    <div className="shell">
      <header className="shell-header">
        <strong>Zephyr Shop</strong>
        <nav>
          <Link to="/" activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/products">Products</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  return (
    <section>
      <h1>TanStack Router + Rsbuild</h1>
      <p>
        This host owns the route tree. The <Link to="/products">products</Link> pages are
        rendered by the catalog remote, loaded at runtime with Module Federation and deployed
        independently with Zephyr Cloud.
      </p>
    </section>
  );
}

function ProductPage() {
  // Params stay fully typed in the host; the remote just receives a prop
  const { productId } = productRoute.useParams();
  return <ProductDetail productId={productId} />;
}

function RemoteError({ error, reset }: ErrorComponentProps) {
  return (
    <section>
      <h2>The catalog remote could not be loaded</h2>
      <pre>{error instanceof Error ? error.message : String(error)}</pre>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
