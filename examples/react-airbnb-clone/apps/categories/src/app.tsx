import { MemoryRouter } from 'react-router-dom';
import Categories from './components/Categories';
import './globals.css';

export default function App() {
  return (
    <MemoryRouter>
      <Categories />
    </MemoryRouter>
  );
}
