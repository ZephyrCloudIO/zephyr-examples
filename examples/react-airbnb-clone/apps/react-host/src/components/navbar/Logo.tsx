import { useNavigate } from 'react-router-dom';
import logo from '../../../public/images/logo.png'

const Logo = () => {
  const navigate = useNavigate();

  return (
    <img
      onClick={() => navigate('/')}
      className="hidden md:block cursor-pointer"
      src={logo}
      height="100"
      width="100"
      alt="Logo"
    />
  );
};

export default Logo;
