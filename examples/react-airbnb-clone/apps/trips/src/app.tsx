import { MemoryRouter } from 'react-router-dom';
import Trips from './trips';
import './globals.css';
import { usersMock } from './common/actions/mocks';
import getReservations from './common/actions/getReservations';

export default function App() {
  return (
    <MemoryRouter>
      <Trips reservations={getReservations()} currentUser={usersMock[0]} />
    </MemoryRouter>
  );
}
