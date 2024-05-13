import { useCallback, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';

import useLoginModal from '../../common/hooks/useLoginModal';
import useRegisterModal from '../../common/hooks/useRegisterModal';
import useRentModal from '../../common/hooks/useRentModal';
import { User } from '../../common/types';

import MenuItem from './MenuItem';
import Avatar from '../Avatar';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  currentUser?: User | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rentModal = useRentModal();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    rentModal.onOpen();
  }, [loginModal, rentModal, currentUser]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="
            hidden
            md:block
            text-sm 
            font-semibold 
            py-3 
            px-4 
            rounded-full 
            hover:bg-neutral-100 
            transition 
            cursor-pointer
          "
        >
          Airbnb your home
        </div>
        <div
          onClick={toggleOpen}
          className="
          p-4
          md:py-1
          md:px-2
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          gap-3 
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem label="My trips" onClick={() => navigate('/trips')} />
                <MenuItem
                  label="My favorites"
                  onClick={() => navigate('/favorites')}
                />
                <MenuItem
                  label="My reservations"
                  onClick={() => navigate('/reservations')}
                />
                <MenuItem
                  label="My properties"
                  onClick={() => navigate('/properties')}
                />
                <MenuItem label="Airbnb your home" onClick={rentModal.onOpen} />
                <hr />
                <MenuItem label="Logout" onClick={() => null} />
              </>
            ) : (
              <>
                <MenuItem label="Login" onClick={loginModal.onOpen} />
                <MenuItem label="Sign up" onClick={registerModal.onOpen} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
