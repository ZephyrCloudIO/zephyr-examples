// import { Nunito } from 'next/font/google';
import Navbar from './components/navbar/Navbar';
import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import SearchModal from './components/modals/SearchModal';
import RentModal from './components/modals/RentModal';

import ToasterProvider from './providers/ToasterProvider';

import useCurrentUser from './common/hooks/useCurrentUser';
import { Outlet } from 'react-router-dom';
import ModalsProvider from './providers/ModalsProvider';

// const font = Nunito({
//   subsets: ['latin'],
// });

export default function RootLayout() {
  const { currentUser } = useCurrentUser();

  return (
    <div>
      <ToasterProvider />
      <ModalsProvider />
      <Navbar currentUser={currentUser} />
      <div className="pb-20 pt-28">
        <Outlet />
      </div>
    </div>
  );
}
