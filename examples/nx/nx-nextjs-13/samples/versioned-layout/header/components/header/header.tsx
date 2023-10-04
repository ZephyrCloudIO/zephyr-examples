/* eslint-disable-next-line */
export interface HeaderProps {}

export function Header(props: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="flex mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 items-end space-x-4">
        <a href="/">
          <h1 className="text-3xl font-bold tracking-tight text-purple-800">
            Zephyr Cloud
          </h1>
        </a>
        <ul className="flex items-center space-x-4">
          <li>
            <a href="/products">Products</a>
          </li>
          <li>
            <a href="/docs">Documentation</a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
