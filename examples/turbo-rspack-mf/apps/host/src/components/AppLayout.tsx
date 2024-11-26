import { Header } from './Header';
import { NavLink, Outlet } from 'react-router';

export default function HomeRoute() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <footer className="bg-black text-white p-4 min-h-24 border-t border-gray-100">
        <h1 className="text-xl">Footer</h1>
      </footer>
    </div>
  );
}
