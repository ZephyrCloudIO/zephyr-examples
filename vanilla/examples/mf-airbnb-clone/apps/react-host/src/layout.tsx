import Navbar from './components/navbar/Navbar';
import ToasterProvider from './providers/ToasterProvider';

import useCurrentUser from './common/hooks/useCurrentUser';
import { Outlet } from 'react-router-dom';
import ModalsProvider from './providers/ModalsProvider';
import RemoteToggle from './components/navbar/RemoteToggle';

export default function RootLayout() {
  const { currentUser } = useCurrentUser();

  return (
    <div>
      <ToasterProvider />
      <ModalsProvider />
      <Navbar currentUser={currentUser} />
      <RemoteToggle />
      <div className="pb-20 pt-28">
        <Outlet />
      </div>
    </div>
  );
}
