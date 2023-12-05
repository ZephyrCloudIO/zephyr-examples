import { Nunito } from 'next/font/google';
import Navbar from '../components/navbar/Navbar';
import LoginModal from '../components/modals/LoginModal';
import RegisterModal from '../components/modals/RegisterModal';
import SearchModal from '../components/modals/SearchModal';
import RentModal from '../components/modals/RentModal';

import ToasterProvider from '../providers/ToasterProvider';

import ClientOnly from '../components/ClientOnly';
import useCurrentUser from '../hooks/useCurrentUser';

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb Clone',
};

const font = Nunito({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useCurrentUser();

  return (
    <div className={font.className}>
      <ClientOnly>
        <ToasterProvider />
        <LoginModal />
        <RegisterModal />
        <SearchModal />
        <RentModal />
        <Navbar currentUser={currentUser} />
      </ClientOnly>
      <div className="pb-20 pt-28">{children}</div>
    </div>
  );
}
