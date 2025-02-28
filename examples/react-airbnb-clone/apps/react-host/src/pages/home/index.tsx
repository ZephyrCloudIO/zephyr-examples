import Container from '../../components/Container';
import { lazy } from 'react';
import RemoteWrap from '../../components/RemoteWrap';
import useShowRemotes from '../../common/hooks/useShowRemotes';

const RemoteHome = lazy(() => import('airbnb_home/Home'));

const Home = () => {
  const { show } = useShowRemotes();
  return (
    <Container>
      <div className={show ? 'pt-32' : 'pt-24'}>
        <RemoteWrap remoteName="home">
          <RemoteHome />
        </RemoteWrap>
      </div>
    </Container>
  );
};

export default Home;
