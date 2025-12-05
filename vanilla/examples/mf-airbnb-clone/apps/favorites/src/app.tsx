import { MemoryRouter } from 'react-router-dom';
import Favorites from './favorites';
import './globals.css';
import { listingsMock, usersMock } from './common/actions/mocks';

export default function App() {
  return (
    <MemoryRouter>
      <Favorites listings={listingsMock} currentUser={usersMock[0]} />
    </MemoryRouter>
  );
}
