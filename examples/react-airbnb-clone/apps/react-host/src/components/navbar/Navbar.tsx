import { lazy } from 'react';
import { User } from '../../common/types';

import Container from '../Container';
import RemoteWrap from '../RemoteWrap';
import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  currentUser?: User | null;
}

const Categories = lazy(() => import('airbnb_categories/Categories'));

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div
        className="
          py-4 
          border-b-[1px]
        "
      >
        <Container>
          <div
            className="
            flex 
            flex-row 
            items-center 
            justify-between
            gap-3
            md:gap-0
          "
          >
            <Logo />
            <Search />
            <UserMenu currentUser={currentUser} />
          </div>
        </Container>
      </div>
      {isMainPage ? (
        <RemoteWrap remoteName="categories">
          <Categories />
        </RemoteWrap>
      ) : null}
    </div>
  );
};

export default Navbar;
