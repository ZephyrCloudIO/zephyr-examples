import { Link, NavLink, Route, Routes, useParams } from "react-router-dom";

function Home() {
  return (
    <section>
      <h1>Home</h1>
      <p>
        This app uses <code>BrowserRouter</code> with no basename and no hash.
      </p>
      <p>
        Open <Link to="/suppliers">/suppliers</Link> or{" "}
        <Link to="/suppliers/1">/suppliers/1</Link>, then refresh.
      </p>
    </section>
  );
}

function Suppliers() {
  return (
    <section>
      <h1>Suppliers</h1>
      <p>If you refreshed this URL and still see this page, SPA fallback works.</p>
      <ul>
        <li>
          <Link to="/suppliers/1">Supplier 1</Link>
        </li>
        <li>
          <Link to="/suppliers/2">Supplier 2</Link>
        </li>
      </ul>
    </section>
  );
}

function SupplierDetails() {
  const { supplierId } = useParams();
  return (
    <section>
      <h1>Supplier {supplierId}</h1>
      <p>Nested path: <code>/suppliers/{supplierId}</code></p>
      <p>
        <Link to="/suppliers">Back to suppliers</Link>
      </p>
    </section>
  );
}

function NotFound() {
  return (
    <section>
      <h1>Not found</h1>
      <p>
        <Link to="/">Go home</Link>
      </p>
    </section>
  );
}

function App() {
  return (
    <div className="app">
      <header>
        <strong>SPA fallback repro</strong>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/suppliers">Suppliers</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/suppliers/:supplierId" element={<SupplierDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
