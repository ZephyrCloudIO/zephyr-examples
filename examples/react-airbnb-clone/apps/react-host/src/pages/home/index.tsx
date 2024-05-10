import Container from '../../components/Container';
import { Suspense, lazy } from 'react';

const RemoteHome = lazy(() => import('home/Home'));

const Home = () => {
  return (
    <Container>
      <Suspense>
        <div className="pt-24">
          <RemoteHome />
        </div>
      </Suspense>
    </Container>
  );
};

export default Home;
