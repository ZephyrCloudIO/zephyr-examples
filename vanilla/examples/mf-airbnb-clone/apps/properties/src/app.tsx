import { MemoryRouter } from 'react-router-dom';
import Properties from './properties';
import './globals.css';
import { listingsMock, usersMock } from './common/actions/mocks';

export default function App() {
  return (
    <MemoryRouter>
      <Properties listings={listingsMock} currentUser={usersMock[0]} />
    </MemoryRouter>
  );
}
