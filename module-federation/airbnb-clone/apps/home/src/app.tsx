import { MemoryRouter } from 'react-router-dom';
import Home from './home';
import './globals.css';

export default function App() {
  return (
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}
